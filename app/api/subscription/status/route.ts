import { NextRequest, NextResponse } from 'next/server'
import { checkSubscriptionStatus } from '@/lib/subscription'

export async function GET(request: NextRequest) {
  try {
    const status = await checkSubscriptionStatus()
    
    return NextResponse.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}