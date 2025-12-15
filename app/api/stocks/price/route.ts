import { NextResponse } from 'next/server'
// OLD CODE (Direct Yahoo API + Manual Caching) - REMOVE AFTER TESTING
// import { connectDB } from '@/lib/db'
// import Price from '@/models/Price'
// import { fetchQuote } from '@/lib/yahoo'
// const CACHE_DURATION = 2 * 60 * 1000

// NEW CODE (Centralized Cache System)
import { getCachedPrice } from '@/lib/priceCache'
import { connectDB } from '@/lib/db'
import Price from '@/models/Price'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
    }

    // NEW CODE (Use centralized cache)
    const price = await getCachedPrice(symbol.toUpperCase())
    
    if (!price) {
      return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
    }

    // Get additional cached data for response
    await connectDB()
    const cached = await (Price as any).findOne({ symbol: symbol.toUpperCase() }).lean()
    
    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      price: price,
      change: cached?.change || 0,
      changePercent: cached?.changePercent || 0,
      timestamp: cached?.updatedAt || new Date(),
      cached: true
    })

    // OLD CODE (Manual Cache Logic) - REMOVE AFTER TESTING
    // const cached = await (Price as any).findOne({
    //   symbol: symbol.toUpperCase(),
    //   timestamp: { $gte: new Date(Date.now() - CACHE_DURATION) },
    // }).lean()
    // 
    // if (cached) {
    //   return NextResponse.json({
    //     symbol: cached.symbol,
    //     price: cached.price,
    //     change: cached.change,
    //     changePercent: cached.changePercent,
    //     timestamp: cached.timestamp,
    //     cached: true,
    //   })
    // }
    // 
    // const quote = await fetchQuote(symbol)
    // 
    // if (!quote) {
    //   return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
    // }
    // 
    // await (Price as any).findOneAndUpdate(
    //   { symbol: quote.symbol },
    //   {
    //     price: quote.price,
    //     change: quote.change,
    //     changePercent: quote.changePercent,
    //     timestamp: new Date(quote.timestamp),
    //     expiresAt: new Date(Date.now() + CACHE_DURATION),
    //   },
    //   { upsert: true }
    // )
    // 
    // return NextResponse.json({ ...quote, cached: false })
  } catch (error) {
    console.error('Price fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
  }
}
