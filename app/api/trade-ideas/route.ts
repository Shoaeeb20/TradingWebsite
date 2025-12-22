import { NextRequest, NextResponse } from 'next/server'
import { checkSubscriptionStatus } from '@/lib/subscription'
import { connectDB } from '@/lib/db'
import TradeIdea from '@/models/TradeIdea'

export async function GET(request: NextRequest) {
  try {
    // Check if user has active subscription
    const subscriptionStatus = await checkSubscriptionStatus()
    if (!subscriptionStatus.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Active subscription required',
          subscriptionStatus 
        },
        { status: 403 }
      )
    }

    await connectDB()

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const action = searchParams.get('action')
    const riskLevel = searchParams.get('riskLevel')
    const timeHorizon = searchParams.get('timeHorizon')

    // Build filter query
    const filter: any = {
      isActive: true,
      expiresAt: { $gt: new Date() } // Only non-expired ideas
    }

    if (type && ['EQUITY', 'FNO'].includes(type)) {
      filter.type = type
    }
    if (action && ['BUY', 'SELL'].includes(action)) {
      filter.action = action
    }
    if (riskLevel && ['LOW', 'MEDIUM', 'HIGH'].includes(riskLevel)) {
      filter.riskLevel = riskLevel
    }
    if (timeHorizon && ['INTRADAY', 'SHORT_TERM', 'MEDIUM_TERM'].includes(timeHorizon)) {
      filter.timeHorizon = timeHorizon
    }

    // Get trade ideas
    const tradeIdeas = await (TradeIdea as any).find(filter)
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 most recent ideas
      .lean()

    return NextResponse.json({
      success: true,
      data: {
        tradeIdeas,
        subscriptionStatus,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching trade ideas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trade ideas' },
      { status: 500 }
    )
  }
}