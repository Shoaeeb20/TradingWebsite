import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Price from '@/models/Price'
import { fetchQuote } from '@/lib/yahoo'

const CACHE_DURATION = 2 * 60 * 1000

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
    }

    await connectDB()

    const cached = await Price.findOne({
      symbol: symbol.toUpperCase(),
      timestamp: { $gte: new Date(Date.now() - CACHE_DURATION) },
    }).lean()

    if (cached) {
      return NextResponse.json({
        symbol: cached.symbol,
        price: cached.price,
        change: cached.change,
        changePercent: cached.changePercent,
        timestamp: cached.timestamp,
        cached: true,
      })
    }

    const quote = await fetchQuote(symbol)

    if (!quote) {
      return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
    }

    await Price.findOneAndUpdate(
      { symbol: quote.symbol },
      {
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        timestamp: new Date(quote.timestamp),
        expiresAt: new Date(Date.now() + CACHE_DURATION),
      },
      { upsert: true }
    )

    return NextResponse.json({ ...quote, cached: false })
  } catch (error) {
    console.error('Price fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
  }
}
