import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { connectDB } from '../../../../lib/db'
import { closeFnoPosition } from '../../../../lib/fno/fnoEngine'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { positionId } = body

    // Validate input
    if (!positionId) {
      return NextResponse.json({ error: 'Position ID required' }, { status: 400 })
    }

    // Close position
    const result = await closeFnoPosition(positionId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      })
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

  } catch (error) {
    console.error('F&O close position API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}