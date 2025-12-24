import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Trade from '@/models/Trade'
import ArchivedTrade from '@/models/ArchivedTrade'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await (User as any).findOne({ email: session.user.email })

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const includeArchived = searchParams.get('archived') === 'true'

    // Get recent trades (last 30 days) from active storage
    const recentTrades = await (Trade as any).find({ userId: user?._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    let allTrades = recentTrades

    // If archived data is requested and we need more records
    if (includeArchived && recentTrades.length < limit) {
      const remainingLimit = limit - recentTrades.length
      
      const archivedTrades = await (ArchivedTrade as any).find({ userId: user?._id })
        .sort({ originalCreatedAt: -1 })
        .limit(remainingLimit)
        .lean()

      // Transform archived trades to match the expected format
      const transformedArchived = archivedTrades.map((trade: any) => ({
        _id: trade.originalTradeId,
        orderId: trade.originalOrderId,
        userId: trade.userId,
        symbol: trade.symbol,
        type: trade.type,
        quantity: trade.quantity,
        price: trade.price,
        total: trade.total,
        createdAt: trade.originalCreatedAt,
        isArchived: true
      }))

      allTrades = [...recentTrades, ...transformedArchived]
    }

    return NextResponse.json(allTrades)
  } catch (error) {
    console.error('Trades fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}
