import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Trade from '@/models/Trade'
import { getUserProgress } from '@/lib/userProgress'
import { checkAchievements, ACHIEVEMENTS } from '@/lib/achievements'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get recent trades (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const recentTrades = await (Trade as any)
      .find({ 
        createdAt: { $gte: oneDayAgo },
        pnl: { $exists: true } // Only completed trades
      })
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Get new users (last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newUsers = await (User as any)
      .find({ createdAt: { $gte: oneWeekAgo } })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Build feed items
    const feedItems: any[] = []

    // Add trade activities
    for (const trade of recentTrades) {
      if (!trade.userId) continue

      // Anonymize some users for privacy (50% chance)
      const isAnonymous = Math.random() > 0.5

      feedItems.push({
        id: `trade-${trade._id}`,
        type: 'trade',
        user: {
          name: trade.userId.name,
          email: trade.userId.email
        },
        content: {
          symbol: trade.symbol,
          amount: Math.abs(trade.quantity * trade.price),
          profit: trade.pnl
        },
        timestamp: trade.createdAt,
        isAnonymous
      })
    }

    // Add new user activities
    for (const user of newUsers) {
      feedItems.push({
        id: `join-${user._id}`,
        type: 'join',
        user: {
          name: user.name,
          email: user.email
        },
        content: {},
        timestamp: user.createdAt,
        isAnonymous: Math.random() > 0.7 // Less anonymization for joins
      })
    }

    // Add milestone activities (simulate some achievements)
    const milestoneUsers = await (User as any)
      .find({ 
        createdAt: { $gte: oneDayAgo },
        firstTradeBonus: true 
      })
      .select('name email createdAt')
      .limit(5)
      .lean()

    for (const user of milestoneUsers) {
      const userProgress = await getUserProgress(user.email)
      if (userProgress) {
        const userStats = {
          totalTrades: userProgress.totalTrades,
          totalProfit: userProgress.totalProfit,
          daysSinceJoined: userProgress.daysSinceJoined,
          hasFirstTrade: userProgress.hasFirstTrade
        }

        // Check which achievements they might have unlocked
        const unlockedAchievements = ACHIEVEMENTS.filter(achievement => 
          achievement.condition(userStats)
        )

        // Add achievement activities for recent achievements
        if (unlockedAchievements.length > 0) {
          const recentAchievement = unlockedAchievements[Math.floor(Math.random() * unlockedAchievements.length)]
          
          feedItems.push({
            id: `achievement-${user._id}-${recentAchievement.id}`,
            type: 'achievement',
            user: {
              name: user.name,
              email: user.email
            },
            content: {
              achievement: recentAchievement.title
            },
            timestamp: user.createdAt,
            isAnonymous: Math.random() > 0.6
          })
        }

        // Add milestone activities
        if (userProgress.totalTrades >= 10) {
          feedItems.push({
            id: `milestone-${user._id}-trades`,
            type: 'milestone',
            user: {
              name: user.name,
              email: user.email
            },
            content: {
              milestone: `${userProgress.totalTrades} trades completed`
            },
            timestamp: user.createdAt,
            isAnonymous: Math.random() > 0.6
          })
        }
      }
    }

    // Sort all feed items by timestamp (newest first)
    feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit final results
    const finalFeed = feedItems.slice(0, limit)

    return NextResponse.json({
      success: true,
      feed: finalFeed,
      count: finalFeed.length
    })
  } catch (error) {
    console.error('Social feed API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch social feed' 
    }, { status: 500 })
  }
}