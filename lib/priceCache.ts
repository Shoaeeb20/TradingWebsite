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

// Refresh all stock prices (called by cron job)
export async function refreshAllPrices(): Promise<{ success: number; failed: number }> {
  await connectDB()

  // Get all active stocks
  const Stock = (await import('@/models/Stock')).default
  const stocks = await (Stock as any).find({ active: true }).select('symbol')

  let success = 0
  let failed = 0

  console.log(`Starting price refresh for ${stocks.length} stocks`)

  // Check circuit breaker before starting
  const YahooProtection = (await import('./yahooProtection')).default
  const protection = YahooProtection.getInstance()
  
  if (protection.isCircuitOpen()) {
    console.log('⚡ Circuit breaker open - skipping price refresh')
    return { success: 0, failed: stocks.length }
  }

  // Process in smaller batches to avoid overwhelming Yahoo API
  const batchSize = 5 // Reduced from 10
  for (let i = 0; i < stocks.length; i += batchSize) {
    const batch = stocks.slice(i, i + batchSize)

    // Process batch sequentially instead of parallel to respect rate limits
    for (const stock of batch) {
      try {
        const quote = await fetchQuote(stock.symbol)
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
    }

    // Break outer loop if circuit opened
    if (protection.isCircuitOpen()) break

    // Longer delay between batches
    if (i + batchSize < stocks.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  console.log(`Price refresh completed: ${success} success, ${failed} failed`)
  return { success, failed }
}
