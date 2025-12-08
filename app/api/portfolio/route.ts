import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email }).lean()
    const holdings = await Holding.find({ userId: user?._id }).lean()

    return NextResponse.json({
      balance: user?.balance || 0,
      holdings: holdings.map((h) => ({
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
      })),
    })
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
