import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { checkSpecificSubscription } from '@/lib/subscription'
import AlgoStrategy from '@/models/AlgoStrategy'
import User from '@/models/User'

// Get user's algo strategy
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check subscription status for both types
    const [tradeIdeasSub, algoTradingSub] = await Promise.all([
      checkSpecificSubscription(user._id.toString(), 'TRADE_IDEAS'),
      checkSpecificSubscription(user._id.toString(), 'ALGO_TRADING')
    ])

    console.log('Algo Trading Subscription Check:', {
      userId: user._id.toString(),
      algoTradingSub
    })

    // Get or create strategy
    let strategy = await (AlgoStrategy as any).findOne({
      userId: user._id,
      strategyType: 'MA_CROSSOVER'
    })

    if (!strategy) {
      // Create default strategy for user
      strategy = await (AlgoStrategy as any).create({
        userId: user._id,
        strategyType: 'MA_CROSSOVER',
        isActive: false,
        symbols: ['RELIANCE', 'TCS', 'INFY'], // Default symbols
        parameters: {
          shortMA: 20,
          longMA: 50,
          quantity: 1
        },
        performance: {
          totalTrades: 0,
          winningTrades: 0,
          totalPnL: 0,
          currentPositions: 0
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        strategy,
        subscription: {
          isActive: algoTradingSub.isActive,
          status: algoTradingSub.status,
          expiresAt: algoTradingSub.expiresAt,
          daysRemaining: algoTradingSub.daysRemaining
        }
      }
    })
  } catch (error) {
    console.error('Error fetching algo strategy:', error)
    return NextResponse.json(
      { error: 'Failed to fetch strategy' },
      { status: 500 }
    )
  }
}

// Update user's algo strategy
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check subscription for algo trading specifically
    const algoSubscription = await checkSpecificSubscription(user._id.toString(), 'ALGO_TRADING')
    
    const body = await request.json()
    const { isActive, symbols, parameters } = body

    // Validate subscription for active trading
    if (isActive && !algoSubscription.isActive) {
      return NextResponse.json({
        error: 'Algo Trading subscription (₹199/month) required for algorithmic trading',
        requiresUpgrade: true
      }, { status: 403 })
    }

    // Validate parameters (pro users can customize, free users get defaults)
    let validatedParams = {
      shortMA: 20,
      longMA: 50,
      quantity: 1
    }

    if (algoSubscription.isActive && parameters) {
      validatedParams = {
        shortMA: Math.max(5, Math.min(50, parameters.shortMA || 20)),
        longMA: Math.max(20, Math.min(200, parameters.longMA || 50)),
        quantity: Math.max(1, Math.min(1000, parameters.quantity || 1))
      }
    }

    // Validate symbols
    let validatedSymbols = ['RELIANCE', 'TCS', 'INFY'] // Default for free users
    if (algoSubscription.isActive && symbols && Array.isArray(symbols)) {
      validatedSymbols = symbols
        .filter((s: string) => typeof s === 'string' && s.length > 0)
        .map((s: string) => s.toUpperCase())
        .slice(0, 10) // Max 10 symbols
    }

    // Update strategy
    const strategy = await (AlgoStrategy as any).findOneAndUpdate(
      { userId: user._id, strategyType: 'MA_CROSSOVER' },
      {
        isActive: algoSubscription.isActive ? !!isActive : false,
        symbols: validatedSymbols,
        parameters: validatedParams
      },
      { new: true, upsert: true }
    )

    return NextResponse.json({
      success: true,
      data: strategy,
      message: algoSubscription.isActive ? 
        'Strategy updated successfully' : 
        'Strategy saved. Upgrade to Algo Trading (₹199/month) to enable active trading.'
    })
  } catch (error) {
    console.error('Error updating algo strategy:', error)
    return NextResponse.json(
      { error: 'Failed to update strategy' },
      { status: 500 }
    )
  }
}

// Manual execution trigger (Pro users only)
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check algo trading subscription
    const algoSubscription = await checkSpecificSubscription(user._id.toString(), 'ALGO_TRADING')
    if (!algoSubscription.isActive) {
      return NextResponse.json({
        error: 'Algo Trading subscription (₹199/month) required for manual execution',
        requiresUpgrade: true
      }, { status: 403 })
    }

    // Import and execute strategy
    const { executeMAStrategy } = await import('@/lib/algo/movingAverageEngine')
    const result = await executeMAStrategy(user._id.toString(), 'MANUAL')

    return NextResponse.json({
      success: result.success,
      data: {
        signalsGenerated: result.signalsGenerated,
        ordersPlaced: result.ordersPlaced,
        executionTime: result.executionTime,
        errors: result.errors
      },
      message: result.success ? 
        'Strategy executed successfully' : 
        'Strategy execution completed with errors'
    })
  } catch (error) {
    console.error('Error executing algo strategy:', error)
    return NextResponse.json(
      { error: 'Failed to execute strategy' },
      { status: 500 }
    )
  }
}