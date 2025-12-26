import { connectDB } from './db'
import Price from '@/models/Price'
import { fetchQuote } from './yahoo'

export interface CachedPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  updatedAt: Date
}

// Get cached price or fetch from Yahoo if cache is stale
// MODIFIED: Longer cache duration for Hobby plan (5 minutes instead of 2)
export async function getCachedPrice(symbol: string): Promise<number | null> {
  await connectDB()

  // Check cache first (prices valid for 5 minutes due to Hobby plan limitations)
  const cachedPrice = await (Price as any).findOne({
    symbol,
    updatedAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
  })

  if (cachedPrice) {
    console.log(cachedPrice)
    return cachedPrice.price
  }

  // Cache miss or stale - fetch from Yahoo as fallback
  try {
    const quote = await fetchQuote(symbol)
    if (quote) {
      // Update cache
      await (Price as any).findOneAndUpdate(
        { symbol },
        {
          symbol,
          price: quote.price,
          change: quote.change || 0,
          changePercent: quote.changePercent || 0,
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      )
      return quote.price
    }
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error)
  }

  // Fallback: Return stale cached price if Yahoo fails
  const stalePrice = await (Price as any).findOne({ symbol }).sort({ updatedAt: -1 })
  if (stalePrice) {
    console.log(`⚠️ Using stale price for ${symbol} (${Math.round((Date.now() - stalePrice.updatedAt.getTime()) / 60000)} minutes old)`)
    return stalePrice.price
  }

  return null
}

// Get multiple cached prices efficiently
export async function getCachedPrices(symbols: string[]): Promise<Record<string, number>> {
  await connectDB()

  const prices: Record<string, number> = {}

  // Get all cached prices in one query
  const cachedPrices = await (Price as any).find({
    symbol: { $in: symbols },
    updatedAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) },
  })

  // Map cached prices
  cachedPrices.forEach((price: any) => {
    prices[price.symbol] = price.price
  })

  return prices
}

// Fast refresh for essential stocks only (called by cron job)
export async function refreshEssentialPrices(): Promise<{ success: number; failed: number }> {
  const startTime = Date.now()
  const TIMEOUT_MS = 20000 // 20 seconds timeout
  
  await connectDB()

  // Get only the most actively traded stocks to reduce load
  const essentialSymbols = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR',
    'ICICIBANK', 'KOTAKBANK', 'SBIN', 'BHARTIARTL', 'ITC',
    'ASIANPAINT', 'LT', 'AXISBANK', 'MARUTI', 'SUNPHARMA'
  ]

  let success = 0
  let failed = 0

  console.log(`Starting fast refresh for ${essentialSymbols.length} essential stocks`)

  // Skip circuit breaker check for essential refresh - just process quickly
  for (const symbol of essentialSymbols) {
    // Check timeout
    if (Date.now() - startTime > TIMEOUT_MS) {
      console.log(`⏰ Timeout reached - stopping at ${symbol}`)
      failed += essentialSymbols.length - essentialSymbols.indexOf(symbol)
      break
    }

    try {
      // Quick fetch with short timeout
      const quote = await Promise.race([
        fetchQuote(symbol),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Quick timeout')), 2000)
        )
      ]) as any

      if (quote) {
        await (Price as any).findOneAndUpdate(
          { symbol },
          {
            symbol,
            price: quote.price,
            change: quote.change || 0,
            changePercent: quote.changePercent || 0,
            updatedAt: new Date(),
          },
          { upsert: true, new: true }
        )
        success++
      } else {
        failed++
      }
    } catch (error) {
      console.error(`Quick refresh failed for ${symbol}:`, error)
      failed++
    }

    // Very short delay between requests
    if (essentialSymbols.indexOf(symbol) < essentialSymbols.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  const duration = (Date.now() - startTime) / 1000
  console.log(`Fast refresh completed in ${duration}s: ${success} success, ${failed} failed`)
  return { success, failed }
}

// Refresh all stock prices (called by cron job)
export async function refreshAllPrices(): Promise<{ success: number; failed: number }> {
  const startTime = Date.now()
  const TIMEOUT_MS = 25000 // 25 seconds timeout to avoid cron job timeouts
  
  await connectDB()

  // Get all active stocks
  const Stock = (await import('@/models/Stock')).default
  const stocks = await (Stock as any).find({ active: true }).select('symbol')

  let success = 0
  let failed = 0

  console.log(`Starting price refresh for ${stocks.length} stocks with ${TIMEOUT_MS/1000}s timeout`)

  // Check circuit breaker before starting
  const YahooProtection = (await import('./yahooProtection')).default
  const protection = YahooProtection.getInstance()
  
  if (protection.isCircuitOpen()) {
    console.log('⚡ Circuit breaker open - skipping price refresh')
    return { success: 0, failed: stocks.length }
  }

  // Process in smaller batches to avoid overwhelming Yahoo API
  const batchSize = 3 // Further reduced for faster processing
  for (let i = 0; i < stocks.length; i += batchSize) {
    // Check timeout
    if (Date.now() - startTime > TIMEOUT_MS) {
      console.log(`⏰ Timeout reached after ${(Date.now() - startTime)/1000}s - stopping refresh`)
      failed += stocks.length - i
      break
    }

    const batch = stocks.slice(i, i + batchSize)

    // Process batch sequentially but with shorter timeout per request
    for (const stock of batch) {
      try {
        // Individual request timeout
        const quote = await Promise.race([
          fetchQuote(stock.symbol),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 3000)
          )
        ]) as any

        if (quote) {
          await (Price as any).findOneAndUpdate(
            { symbol: stock.symbol },
            {
              symbol: stock.symbol,
              price: quote.price,
              change: quote.change || 0,
              changePercent: quote.changePercent || 0,
              updatedAt: new Date(),
            },
            { upsert: true, new: true }
          )
          success++
        } else {
          failed++
        }
      } catch (error) {
        console.error(`Failed to refresh ${stock.symbol}:`, error)
        failed++
      }
      
      // Check if circuit opened during batch
      if (protection.isCircuitOpen()) {
        console.log('⚡ Circuit opened during refresh - stopping')
        failed += stocks.length - (i + batch.indexOf(stock) + 1)
        break
      }

      // Check timeout again
      if (Date.now() - startTime > TIMEOUT_MS) {
        console.log(`⏰ Timeout reached during batch processing`)
        failed += stocks.length - (i + batch.indexOf(stock) + 1)
        break
      }
    }

    // Break outer loop if circuit opened or timeout
    if (protection.isCircuitOpen() || Date.now() - startTime > TIMEOUT_MS) break

    // Shorter delay between batches for faster processing
    if (i + batchSize < stocks.length) {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Reduced from 2000ms
    }
  }

  const duration = (Date.now() - startTime) / 1000
  console.log(`Price refresh completed in ${duration}s: ${success} success, ${failed} failed`)
  return { success, failed }
}
