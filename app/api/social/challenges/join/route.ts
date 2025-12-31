import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const { challengeId } = await request.json()
    if (!challengeId) {
      return NextResponse.json({ success: false, message: 'Challenge ID required' }, { status: 400 })
    }

    await connectDB()
    
    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Initialize challenges array if it doesn't exist
    if (!user.activeChallenges) {
      user.activeChallenges = []
    }

    // Check if already participating
    const isAlreadyParticipating = user.activeChallenges.some((c: any) => c.challengeId === challengeId)
    
    if (isAlreadyParticipating) {
      return NextResponse.json({ 
        success: false, 
        message: 'Already participating in this challenge' 
      }, { status: 400 })
    }

    // Add challenge to user's active challenges
    user.activeChallenges.push({
      challengeId,
      joinedAt: new Date(),
      progress: 0
    })

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Successfully joined challenge!'
    })
  } catch (error) {
    console.error('Challenge join API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to join challenge' 
    }, { status: 500 })
  }
}