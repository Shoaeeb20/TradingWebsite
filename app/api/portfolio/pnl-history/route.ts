import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import DailyPnL from '@/models/DailyPnL'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await (User as any).findOne({ email: session.user.email })

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const dailyPnL = await (DailyPnL as any).find({
      userId: user?._id,
      date: { $gte: startDate }
    })
    .sort({ date: -1 })
    .lean()

    return NextResponse.json({
      success: true,
      data: dailyPnL
    })
  } catch (error) {
    console.error('P&L history fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch P&L history' }, { status: 500 })
  }
}