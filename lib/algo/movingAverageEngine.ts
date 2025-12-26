import { connectDB } from '@/lib/db'
import { isMarketOpen } from '@/lib/marketHours'
import { getCachedPrice } from '@/lib/priceCache'
import { placeOrder } from '@/lib/tradingEngine'
import { checkSpecificSubscription } from '@/lib/subscription'
import AlgoStrategy from '@/models/AlgoStrategy'
import AlgoRun from '@/models/AlgoRun'
import Trade from '@/models/Trade'
import Holding from '@/models/Holding'
import Price from '@/models/Price'

export interface MASignal {
  symbol: string
  signal: 'BUY' | 'SELL' | 'HOLD'
  shortMA: number
  longMA: number
  price: number
  confidence: number
}

export interface ExecutionResult {
  success: boolean
  runId?: string
  signalsGenerated: number
  ordersPlaced: number
  errors: string[]
  executionTime: number
}

/**
 * Calculate Simple Moving Average for a symbol
 */
async function calculateMA(symbol: string, periods: number): Promise<number | null> {
  try {
    // Get historical prices from the last 'periods' trades
    const recentTrades = await (Trade as any)
      .find({ symbol })
      .sort({ createdAt: -1 })
      .limit(periods)
      .lean()

    if (recentTrades.length < periods) {
      // Not enough data for MA calculation
      return null
    }

    const prices = recentTrades.map((trade: any) => trade.price)
    const sum = prices.reduce((acc: number, price: number) => acc + price, 0)
    return sum / periods
  } catch (error) {
    console.error(`Error calculating MA for ${symbol}:`, error)
    return null
  }
}

/**
 * Generate trading signal based on MA crossover
 */
async function generateSignal(
  symbol: string, 
  shortPeriod: number, 
  longPeriod: number,
  lastSignal?: { signal: string; shortMA: number; longMA: number }
): Promise<MASignal | null> {
  try {
    const [shortMA, longMA, currentPrice] = await Promise.all([
      calculateMA(symbol, shortPeriod),
      calculateMA(symbol, longPeriod),
      getCachedPrice(symbol)
    ])

    if (!shortMA || !longMA || !currentPrice) {
      return null
    }

    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD'
    let confidence = 0

    // Determine signal based on crossover
    if (shortMA > longMA) {
      // Short MA above Long MA - potential BUY signal
      if (lastSignal && lastSignal.shortMA <= lastSignal.longMA) {
        // Crossover just happened - strong BUY signal
        signal = 'BUY'
        confidence = Math.min(((shortMA - longMA) / longMA) * 100, 100)
      } else if (!lastSignal) {
        // First run and short > long - moderate BUY
        signal = 'BUY'
        confidence = 50
      }
    } else if (shortMA < longMA) {
      // Short MA below Long MA - potential SELL signal
      if (lastSignal && lastSignal.shortMA >= lastSignal.longMA) {
        // Crossover just happened - strong SELL signal
        signal = 'SELL'
        confidence = Math.min(((longMA - shortMA) / longMA) * 100, 100)
      }
    }

    return {
      symbol,
      signal,
      shortMA,
      longMA,
      price: currentPrice,
      confidence
    }
  } catch (error) {
    console.error(`Error generating signal for ${symbol}:`, error)
    return null
  }
}

/**
 * Check if user has existing position in symbol
 */
async function hasPosition(userId: string, symbol: string): Promise<boolean> {
  try {
    const holding = await (Holding as any).findOne({
      userId,
      symbol,
      quantity: { $gt: 0 }
    })
    return !!holding
  } catch (error) {
    console.error(`Error checking position for ${symbol}:`, error)
    return false
  }
}

/**
 * Execute trading signal by placing order
 */
async function executeSignal(
  userId: string,
  signal: MASignal,
  quantity: number
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const { symbol, signal: action, price } = signal

    // Check if we should place an order
    if (action === 'HOLD') {
      return { success: true }
    }

    // For BUY signals, check if we already have a position
    if (action === 'BUY') {
      const hasExistingPosition = await hasPosition(userId, symbol)
      if (hasExistingPosition) {
        return { success: true } // Skip - already have position
      }
    }

    // For SELL signals, check if we have a position to sell
    if (action === 'SELL') {
      const hasExistingPosition = await hasPosition(userId, symbol)
      if (!hasExistingPosition) {
        return { success: true } // Skip - no position to sell
      }
    }

    // Place the order using existing trading engine
    const orderResult = await placeOrder(userId, {
      symbol,
      type: action,
      orderType: 'MARKET',
      productType: 'DELIVERY',
      quantity,
      // Add algo source tag
      source: 'ALGO_MA_CROSSOVER'
    } as any)

    if (orderResult.success) {
      return { success: true, orderId: orderResult.orderId }
    } else {
      return { success: false, error: orderResult.message }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Execute MA Crossover strategy for a user
 */
export async function executeMAStrategy(
  userId: string,
  executionType: 'CRON' | 'MANUAL' = 'CRON'
): Promise<ExecutionResult> {
  const startTime = Date.now()
  const errors: string[] = []

  try {
    await connectDB()

    // Check algo trading subscription
    const subscription = await checkSpecificSubscription(userId, 'ALGO_TRADING')
    if (!subscription.isActive) {
      return {
        success: false,
        signalsGenerated: 0,
        ordersPlaced: 0,
        errors: ['Algo Trading subscription not active'],
        executionTime: Date.now() - startTime
      }
    }

    // Check market hours
    const marketStatus = isMarketOpen()
    if (!marketStatus.open) {
      // Log skipped run
      await (AlgoRun as any).create({
        userId,
        strategyId: null, // Will be updated if strategy found
        strategyType: 'MA_CROSSOVER',
        executionType,
        status: 'SKIPPED',
        reason: marketStatus.message,
        marketStatus,
        symbolsProcessed: [],
        signalsGenerated: [],
        executionTime: Date.now() - startTime
      })

      return {
        success: false,
        signalsGenerated: 0,
        ordersPlaced: 0,
        errors: [marketStatus.message || 'Market closed'],
        executionTime: Date.now() - startTime
      }
    }

    // Get user's algo strategy
    const strategy = await (AlgoStrategy as any).findOne({
      userId,
      strategyType: 'MA_CROSSOVER',
      isActive: true
    })

    if (!strategy) {
      return {
        success: false,
        signalsGenerated: 0,
        ordersPlaced: 0,
        errors: ['No active MA Crossover strategy found'],
        executionTime: Date.now() - startTime
      }
    }

    const signals: any[] = []
    let ordersPlaced = 0

    // Process each symbol in the strategy
    for (const symbol of strategy.symbols) {
      try {
        const signal = await generateSignal(
          symbol,
          strategy.parameters.shortMA,
          strategy.parameters.longMA,
          strategy.lastSignal?.symbol === symbol ? strategy.lastSignal : undefined
        )

        if (!signal) {
          errors.push(`Could not generate signal for ${symbol} - insufficient data`)
          continue
        }

        // Execute the signal
        const execution = await executeSignal(
          userId,
          signal,
          strategy.parameters.quantity
        )

        const signalRecord = {
          symbol: signal.symbol,
          signal: signal.signal,
          shortMA: signal.shortMA,
          longMA: signal.longMA,
          price: signal.price,
          action: execution.success ? 
            (execution.orderId ? 'ORDER_PLACED' : 'NO_ACTION') : 'ERROR',
          orderId: execution.orderId,
          error: execution.error
        }

        signals.push(signalRecord)

        if (execution.orderId) {
          ordersPlaced++
        }

        // Update strategy's last signal
        if (signal.signal !== 'HOLD') {
          strategy.lastSignal = {
            symbol: signal.symbol,
            signal: signal.signal,
            timestamp: new Date(),
            shortMA: signal.shortMA,
            longMA: signal.longMA,
            price: signal.price
          }
        }

      } catch (error) {
        errors.push(`Error processing ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Update strategy
    strategy.lastRun = new Date()
    if (ordersPlaced > 0) {
      strategy.performance.totalTrades += ordersPlaced
    }
    await strategy.save()

    // Create run log
    const runLog = await (AlgoRun as any).create({
      userId,
      strategyId: strategy._id,
      strategyType: 'MA_CROSSOVER',
      executionType,
      status: errors.length === 0 ? 'SUCCESS' : 'FAILED',
      reason: errors.length > 0 ? errors.join('; ') : undefined,
      marketStatus,
      symbolsProcessed: strategy.symbols,
      signalsGenerated: signals,
      executionTime: Date.now() - startTime
    })

    return {
      success: errors.length === 0,
      runId: runLog._id.toString(),
      signalsGenerated: signals.length,
      ordersPlaced,
      errors,
      executionTime: Date.now() - startTime
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    errors.push(errorMessage)

    return {
      success: false,
      signalsGenerated: 0,
      ordersPlaced: 0,
      errors,
      executionTime: Date.now() - startTime
    }
  }
}

/**
 * Execute MA strategy for all active users (for cron)
 */
export async function executeAllMAStrategies(): Promise<{
  success: boolean
  usersProcessed: number
  totalOrders: number
  errors: string[]
}> {
  try {
    await connectDB()

    // Get all active MA strategies
    const activeStrategies = await (AlgoStrategy as any)
      .find({ 
        strategyType: 'MA_CROSSOVER', 
        isActive: true 
      })
      .populate('userId', '_id')

    const results = []
    let totalOrders = 0
    const errors: string[] = []

    for (const strategy of activeStrategies) {
      try {
        const result = await executeMAStrategy(strategy.userId._id.toString(), 'CRON')
        results.push(result)
        totalOrders += result.ordersPlaced
        errors.push(...result.errors)
      } catch (error) {
        errors.push(`Error processing user ${strategy.userId._id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      success: errors.length === 0,
      usersProcessed: activeStrategies.length,
      totalOrders,
      errors
    }
  } catch (error) {
    return {
      success: false,
      usersProcessed: 0,
      totalOrders: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}