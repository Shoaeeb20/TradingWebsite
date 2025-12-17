import { SpotCache } from './fnoTypes'
import YahooProtection from '../yahooProtection'

// In-memory cache for spot prices - reduced to 5 minutes for better F&O accuracy
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes (reduced from 10)
let spotCache: SpotCache = { NIFTY: null, BANKNIFTY: null }

// Yahoo Finance symbols for indices
const YAHOO_SYMBOLS = {
  NIFTY: '^NSEI',
  BANKNIFTY: '^NSEBANK'
}

export async function getSpotPrices(): Promise<{ NIFTY: number; BANKNIFTY: number }> {
  const now = Date.now()
  const protection = YahooProtection.getInstance()
  
  // Check if cache is valid
  const niftyValid = spotCache.NIFTY && (now - spotCache.NIFTY.timestamp) < CACHE_TTL
  const bankNiftyValid = spotCache.BANKNIFTY && (now - spotCache.BANKNIFTY.timestamp) < CACHE_TTL
  
  if (niftyValid && bankNiftyValid) {
    return {
      NIFTY: spotCache.NIFTY!.price,
      BANKNIFTY: spotCache.BANKNIFTY!.price
    }
  }
  
  // Check circuit breaker before making API calls
  if (protection.isCircuitOpen()) {
    console.log('⚡ Circuit breaker open - using cached F&O spot prices')
    return {
      NIFTY: spotCache.NIFTY?.price || 19500,
      BANKNIFTY: spotCache.BANKNIFTY?.price || 44000
    }
  }
  
  // Use protection layer for NIFTY price fetch
  const niftyPrice = await protection.queueRequest('NIFTY_SPOT', async () => {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${YAHOO_SYMBOLS.NIFTY}`,
      { 
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000)
      }
    )
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API failed: ${response.status}`)
    }
    
    const data = await response.json()
    return data.chart?.result?.[0]?.meta?.regularMarketPrice || null
  })
  
  // Use protection layer for BANKNIFTY price fetch
  const bankNiftyPrice = await protection.queueRequest('BANKNIFTY_SPOT', async () => {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${YAHOO_SYMBOLS.BANKNIFTY}`,
      { 
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000)
      }
    )
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API failed: ${response.status}`)
    }
    
    const data = await response.json()
    return data.chart?.result?.[0]?.meta?.regularMarketPrice || null
  })
  
  // Update cache with fetched prices (or keep existing if fetch failed)
  if (niftyPrice !== null) {
    spotCache.NIFTY = { price: niftyPrice, timestamp: now }
  }
  if (bankNiftyPrice !== null) {
    spotCache.BANKNIFTY = { price: bankNiftyPrice, timestamp: now }
  }
  
  return {
    NIFTY: spotCache.NIFTY?.price || 19500,
    BANKNIFTY: spotCache.BANKNIFTY?.price || 44000
  }
}

export function getCachedSpotPrice(index: 'NIFTY' | 'BANKNIFTY'): number | null {
  const cached = spotCache[index]
  if (!cached) return null
  
  const isValid = (Date.now() - cached.timestamp) < CACHE_TTL
  return isValid ? cached.price : null
}