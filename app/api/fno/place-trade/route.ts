import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { connectDB } from '../../../../lib/db'
import { executeFnoTrade } from '../../../../lib/fno/fnoEngine'
import { getNextExpiry } from '../../../../lib/fno/fnoPricing'
import { FnoTrade, FnoIndex, OptionType, FnoAction } from '../../../../lib/fno/fnoTypes'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { index, strike, optionType, action, quantity } = body

    // Validate input
    if (!index || !strike || !optionType || !action || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['NIFTY', 'BANKNIFTY'].includes(index)) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 })
    }

    if (!['CE', 'PE'].includes(optionType)) {
      return NextResponse.json({ error: 'Invalid option type' }, { status: 400 })
    }

    if (!['BUY', 'SELL'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (quantity <= 0 || quantity > 1000) {
      return NextResponse.json({ error: 'Invalid quantity (1-1000)' }, { status: 400 })
    }

    // Validate strike price format
    const strikeInterval = index === 'NIFTY' ? 50 : 100
    if (strike % strikeInterval !== 0) {
      return NextResponse.json({ 
        error: `Invalid strike price. Must be multiple of ${strikeInterval}` 
      }, { status: 400 })
    }

    // Create trade object
    const trade: FnoTrade = {
      userId: session.user.id,
      contract: {
        index: index as FnoIndex,
        strike: Number(strike),
        optionType: optionType as OptionType,
        expiry: getNextExpiry()
      },
      action: action as FnoAction,
      quantity: Number(quantity),
      price: 0, // Will be calculated by engine
      timestamp: new Date()
    }

    // Execute trade
    const result = await executeFnoTrade(trade)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        position: result.position
      })
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

  } catch (error) {
    console.error('F&O trade API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}