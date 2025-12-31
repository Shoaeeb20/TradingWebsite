import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getUserProgress } from '@/lib/userProgress'
import { checkAchievements, getUnlockedAchievements, ACHIEVEMENTS } from '@/lib/achievements'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    await connectDB()
    
    const userProgress = await getUserProgress(session.user.email)
    if (!userProgress) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const userStats = {
      totalTrades: userProgress.totalTrades,
      totalProfit: userProgress.totalProfit,
      daysSinceJoined: userProgress.daysSinceJoined,
      hasFirstTrade: userProgress.hasFirstTrade
    }

    const unlockedAchievements = getUnlockedAchievements(userStats)
    
    return NextResponse.json({
      success: true,
      data: {
        unlocked: unlockedAchievements,
        total: ACHIEVEMENTS.length,
        userStats
      }
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    await connectDB()
    
    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const userProgress = await getUserProgress(session.user.email)
    if (!userProgress) {
      return NextResponse.json({ success: false, message: 'User progress not found' }, { status: 404 })
    }

    const currentStats = {
      totalTrades: userProgress.totalTrades,
      totalProfit: userProgress.totalProfit,
      daysSinceJoined: userProgress.daysSinceJoined,
      hasFirstTrade: userProgress.hasFirstTrade
    }

    // Get previous stats from user document (if stored)
    const previousStats = user.lastAchievementCheck ? {
      totalTrades: user.lastAchievementCheck.totalTrades || 0,
      totalProfit: user.lastAchievementCheck.totalProfit || 0,
      daysSinceJoined: user.lastAchievementCheck.daysSinceJoined || 0,
      hasFirstTrade: user.lastAchievementCheck.hasFirstTrade || false
    } : undefined

    // Check for new achievements
    const newAchievements = checkAchievements(currentStats, previousStats)
    
    // Award bonuses for new achievements
    let totalBonus = 0
    for (const achievement of newAchievements) {
      if (achievement.reward && achievement.reward.includes('₹')) {
        const bonusAmount = parseInt(achievement.reward.replace(/[^\d]/g, ''))
        totalBonus += bonusAmount
      }
    }

    // Update user with bonus and achievement check timestamp
    if (totalBonus > 0) {
      await (User as any).findByIdAndUpdate(user._id, {
        $inc: { balance: totalBonus },
        $set: { 
          lastAchievementCheck: currentStats,
          lastAchievementCheckDate: new Date()
        }
      })
    } else {
      await (User as any).findByIdAndUpdate(user._id, {
        $set: { 
          lastAchievementCheck: currentStats,
          lastAchievementCheckDate: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        newAchievements,
        totalBonus,
        message: newAchievements.length > 0 
          ? `Unlocked ${newAchievements.length} new achievement${newAchievements.length > 1 ? 's' : ''}!`
          : 'No new achievements'
      }
    })
  } catch (error) {
    console.error('Error checking achievements:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}