import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Trade from '@/models/Trade'

// Disable caching for real-time data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    await connectDB()

    // Get total number of users
    const totalTraders = await (User as any).countDocuments()

    // Get active traders (users who have made at least one trade in the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeTraderIds = await (Trade as any).distinct('userId', {
      createdAt: { $gte: thirtyDaysAgo }
    })
    const activeTraders = activeTraderIds.length

    // Calculate inactive traders
    const inactiveTraders = totalTraders - activeTraders

    // Get users who joined in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const newTraders = await (User as any).countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    // Get total trades count
    const totalTrades = await (Trade as any).countDocuments()

    // Get trades in the last 24 hours
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    const tradesLast24h = await (Trade as any).countDocuments({
      createdAt: { $gte: twentyFourHoursAgo }
    })

    // Get top performing trader (highest ROI)
    const users = await (User as any)
      .find({})
      .select('name balance fnoBalance initialCapital totalTopUps totalWithdrawals')
      .lean()

    let topTrader = null
    let highestROI = -Infinity

    users.forEach((user: any) => {
      const currentValue = (user.balance || 0) + (user.fnoBalance || 0)
      const initialCapital = user.initialCapital || 200000
      const totalTopUps = user.totalTopUps || 0
      const totalWithdrawals = user.totalWithdrawals || 0
      const totalInvested = initialCapital + totalTopUps - totalWithdrawals
      
      const roi = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0
      
      if (roi > highestROI) {
        highestROI = roi
        topTrader = {
          name: user.name,
          roi: roi
        }
      }
    })

    const response = NextResponse.json({
      totalTraders,
      activeTraders,
      inactiveTraders,
      newTraders,
      totalTrades,
      tradesLast24h,
      topTrader,
      lastUpdated: new Date().toISOString()
    })

    // Set cache headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Community stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch community stats' }, { status: 500 })
  }
}