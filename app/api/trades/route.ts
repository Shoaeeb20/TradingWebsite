import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Trade from '@/models/Trade'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const trades = await Trade.find({ userId: user?._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json(trades)
  } catch (error) {
    console.error('Trades fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}
