import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { getUserProgress } from '@/lib/userProgress'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Get user progress if authenticated
    let userProgress = null
    if (session?.user?.email) {
      await connectDB()
      userProgress = await getUserProgress(session.user.email)
    }

    // Generate dynamic challenges based on current date
    const now = new Date()
    const currentWeek = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000))
    const currentMonth = now.getMonth()

    const challenges = [
      // Weekly Challenge
      {
        id: `weekly-${currentWeek}`,
        title: 'Weekly Trader',
        description: 'Complete 10 trades this week',
        type: 'weekly' as const,
        target: 10,
        current: userProgress ? Math.min(userProgress.totalTrades % 10, 10) : 0,
        reward: '₹5,000 bonus',
        participants: Math.floor(Math.random() * 50) + 20,
        endDate: new Date(now.getTime() + (7 - now.getDay()) * 24 * 60 * 60 * 1000).toISOString(),
        icon: '📈',
        difficulty: 'medium' as const,
        isParticipating: userProgress ? userProgress.totalTrades > 0 : false
      },
      
      // Daily Challenge
      {
        id: `daily-${now.getDate()}`,
        title: 'Daily Momentum',
        description: 'Make 3 profitable trades today',
        type: 'daily' as const,
        target: 3,
        current: userProgress ? Math.min(Math.floor(Math.random() * 4), 3) : 0,
        reward: '₹1,000 bonus',
        participants: Math.floor(Math.random() * 30) + 15,
        endDate: new Date(now.getTime() + (24 - now.getHours()) * 60 * 60 * 1000).toISOString(),
        icon: '⚡',
        difficulty: 'easy' as const,
        isParticipating: userProgress ? userProgress.hasFirstTrade : false
      },

      // Monthly Challenge
      {
        id: `monthly-${currentMonth}`,
        title: 'Monthly Master',
        description: 'Achieve 15% ROI this month',
        type: 'monthly' as const,
        target: 15,
        current: userProgress ? Math.max(0, Math.min(userProgress.totalProfit / 10000 * 100, 15)) : 0,
        reward: '₹25,000 bonus + Badge',
        participants: Math.floor(Math.random() * 100) + 50,
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
        icon: '🏆',
        difficulty: 'hard' as const,
        isParticipating: userProgress ? userProgress.totalTrades >= 5 : false
      },

      // Beginner Challenge
      {
        id: 'beginner-first-week',
        title: 'First Week Hero',
        description: 'Complete your first 5 trades',
        type: 'weekly' as const,
        target: 5,
        current: userProgress ? Math.min(userProgress.totalTrades, 5) : 0,
        reward: '₹2,500 bonus',
        participants: Math.floor(Math.random() * 40) + 25,
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '🌟',
        difficulty: 'easy' as const,
        isParticipating: userProgress ? userProgress.hasFirstTrade : false
      },

      // Social Challenge
      {
        id: 'social-community',
        title: 'Community Builder',
        description: 'Help 3 new traders get started',
        type: 'weekly' as const,
        target: 3,
        current: Math.floor(Math.random() * 2), // Placeholder
        reward: '₹3,000 bonus + Mentor Badge',
        participants: Math.floor(Math.random() * 20) + 10,
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '🤝',
        difficulty: 'medium' as const,
        isParticipating: userProgress ? userProgress.totalTrades >= 10 : false
      }
    ]

    // Filter challenges based on user level
    let filteredChallenges = challenges
    if (userProgress) {
      if (userProgress.totalTrades >= 5) {
        // Remove beginner challenge for experienced users
        filteredChallenges = challenges.filter(c => c.id !== 'beginner-first-week')
      } else {
        // Show only beginner-friendly challenges for new users
        filteredChallenges = challenges.filter(c => 
          c.difficulty === 'easy' || c.id === 'beginner-first-week'
        )
      }
    }

    return NextResponse.json({
      success: true,
      challenges: filteredChallenges
    })
  } catch (error) {
    console.error('Social challenges API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch challenges' 
    }, { status: 500 })
  }
}