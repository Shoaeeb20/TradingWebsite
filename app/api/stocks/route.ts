import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Stock from '@/models/Stock'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')

    const query = search
      ? {
          active: true,
          $or: [
            { symbol: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
          ],
        }
      : { active: true }

    const stocks = await (Stock as any).find(query).sort({ symbol: 1 }).limit(limit).lean()

    return NextResponse.json(stocks)
  } catch (error) {
    console.error('Stocks fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 })
  }
}
