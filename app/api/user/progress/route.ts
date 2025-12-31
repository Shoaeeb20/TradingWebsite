import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProgress, awardFirstTradeBonus } from '@/lib/userProgress'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await getUserProgress(session.user.email)
    
    if (!progress) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bonusAwarded = await awardFirstTradeBonus(session.user.email)
    
    return NextResponse.json({
      success: true,
      bonusAwarded,
      message: bonusAwarded ? 'First trade bonus awarded!' : 'Bonus already awarded or error occurred'
    })
  } catch (error) {
    console.error('Error awarding first trade bonus:', error)
    return NextResponse.json(
      { error: 'Failed to award bonus' },
      { status: 500 }
    )
  }
}