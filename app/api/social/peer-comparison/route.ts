import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getUserProgress } from '@/lib/userProgress'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    await connectDB()

    // Get current user's progress
    const userProgress = await getUserProgress(session.user.email)
    if (!userProgress) {
      return NextResponse.json({ success: false, message: 'User progress not found' }, { status: 404 })
    }

    // Get leaderboard data (simplified version)
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/leaderboard?limit=1000`)
    const leaderboardData = await response.json()
    
    if (!leaderboardData.users) {
      throw new Error('Failed to fetch leaderboard data')
    }

    const allUsers = leaderboardData.users
    const currentUser = await (User as any).findOne({ email: session.user.email })
    
    // Find user's position in leaderboard
    const userRank = allUsers.findIndex((u: any) => u.email === session.user.email) + 1
    const userROI = userRank > 0 ? allUsers[userRank - 1].returnPercent : 0
    const totalUsers = allUsers.length

    // Calculate percentile (higher is better)
    const percentile = userRank > 0 ? ((totalUsers - userRank + 1) / totalUsers) * 100 : 0

    // Find similar traders (within ±20 trades of user)
    const userTrades = userProgress.totalTrades
    const similarTraders = allUsers.filter((u: any) => {
      // Get estimated trades (we don't have exact trade count in leaderboard, so estimate)
      const estimatedTrades = Math.max(1, Math.floor(Math.random() * 50)) // Placeholder
      return Math.abs(estimatedTrades - userTrades) <= 20 && u.email !== session.user.email
    })

    const similarTradersStats = {
      avgROI: similarTraders.length > 0 
        ? similarTraders.reduce((sum: number, u: any) => sum + u.returnPercent, 0) / similarTraders.length
        : 0,
      avgTrades: userTrades, // Simplified
      count: similarTraders.length
    }

    // Get top 3 performers
    const topPerformers = allUsers.slice(0, 3).map((u: any) => ({
      name: u.name,
      roi: u.returnPercent,
      trades: Math.max(1, Math.floor(Math.random() * 100)) // Placeholder
    }))

    // Generate insights
    const insights: string[] = []
    
    if (percentile >= 75) {
      insights.push("You're performing better than most traders! Keep up the great work.")
    } else if (percentile >= 50) {
      insights.push("You're doing well! Consider increasing your trading frequency.")
    } else {
      insights.push("Focus on learning from top performers to improve your strategy.")
    }

    if (userTrades < 10) {
      insights.push("More trading experience could help improve your performance.")
    } else if (userTrades > 50) {
      insights.push("You're an active trader! Focus on quality over quantity.")
    }

    if (userROI > similarTradersStats.avgROI) {
      insights.push("You're outperforming similar traders in your activity level.")
    } else {
      insights.push("Study strategies from traders with similar activity levels.")
    }

    const peerData = {
      userRank: userRank || totalUsers,
      userROI,
      userTrades,
      totalUsers,
      percentile,
      similarTraders: similarTradersStats,
      topPerformers,
      insights
    }

    return NextResponse.json({
      success: true,
      data: peerData
    })
  } catch (error) {
    console.error('Peer comparison API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch peer comparison' 
    }, { status: 500 })
  }
}