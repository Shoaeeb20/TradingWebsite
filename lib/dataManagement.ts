import mongoose from 'mongoose'
import { connectDB } from './db'
import Order from '@/models/Order'
import Trade from '@/models/Trade'
import ArchivedOrder from '@/models/ArchivedOrder'
import ArchivedTrade from '@/models/ArchivedTrade'
import DailyPnL from '@/models/DailyPnL'
import DataCleanupLog from '@/models/DataCleanupLog'

export interface CleanupStats {
  eligibleTrades: number
  eligibleOrders: number
  oldestTradeDate?: Date
  newestTradeDate?: Date
  oldestOrderDate?: Date
  newestOrderDate?: Date
}

export interface CleanupResult {
  success: boolean
  stats: {
    tradesProcessed: number
    ordersProcessed: number
    dailyPnLCreated: number
    tradesArchived: number
    tradesDeleted: number
    ordersArchived: number
    ordersDeleted: number
  }
  error?: string
  logId?: string
}

/**
 * Get statistics about data eligible for cleanup without executing
 */
export async function getCleanupStats(): Promise<CleanupStats> {
  await connectDB()

  // Calculate cutoff dates
  const tradesCutoff = new Date()
  tradesCutoff.setDate(tradesCutoff.getDate() - 30)
  tradesCutoff.setHours(0, 0, 0, 0)

  const ordersCutoff = new Date()
  ordersCutoff.setDate(ordersCutoff.getDate() - 60)
  ordersCutoff.setHours(0, 0, 0, 0)

  // Get eligible trades (older than 30 days)
  const eligibleTrades = await (Trade as any).find({
    createdAt: { $lt: tradesCutoff }
  }).sort({ createdAt: 1 })

  // Get eligible orders (older than 60 days, completed only)
  const eligibleOrders = await (Order as any).find({
    status: { $in: ['FILLED', 'CANCELLED'] },
    $or: [
      { filledAt: { $exists: true, $lt: ordersCutoff } },
      { cancelledAt: { $exists: true, $lt: ordersCutoff } }
    ]
  }).sort({ createdAt: 1 })

  return {
    eligibleTrades: eligibleTrades.length,
    eligibleOrders: eligibleOrders.length,
    oldestTradeDate: eligibleTrades[0]?.createdAt,
    newestTradeDate: eligibleTrades[eligibleTrades.length - 1]?.createdAt,
    oldestOrderDate: eligibleOrders[0]?.createdAt,
    newestOrderDate: eligibleOrders[eligibleOrders.length - 1]?.createdAt,
  }
}

/**
 * Create daily P&L summaries for trades before archiving
 */
async function createDailyPnLSummaries(trades: any[], session: mongoose.ClientSession): Promise<number> {
  const dailyStats = new Map<string, {
    userId: string
    date: Date
    totalTrades: number
    totalVolume: number
    realizedPnL: number
    symbols: Set<string>
  }>()

  // Group trades by user and date
  for (const trade of trades) {
    const dateKey = trade.createdAt.toISOString().split('T')[0]
    const userDateKey = `${trade.userId}_${dateKey}`
    
    if (!dailyStats.has(userDateKey)) {
      dailyStats.set(userDateKey, {
        userId: trade.userId,
        date: new Date(dateKey),
        totalTrades: 0,
        totalVolume: 0,
        realizedPnL: 0,
        symbols: new Set()
      })
    }

    const stats = dailyStats.get(userDateKey)!
    stats.totalTrades++
    stats.totalVolume += trade.total
    stats.symbols.add(trade.symbol)
    
    // For P&L calculation, we need to determine if this was a profitable trade
    // This is simplified - in reality, P&L is calculated when positions are closed
    // Here we're just tracking volume for historical reference
  }

  // Create DailyPnL records
  let created = 0
  for (const [, stats] of dailyStats) {
    try {
      await (DailyPnL as any).findOneAndUpdate(
        { userId: stats.userId, date: stats.date },
        {
          totalTrades: stats.totalTrades,
          totalVolume: stats.totalVolume,
          realizedPnL: 0, // Simplified - actual P&L calculation would be more complex
          topSymbols: Array.from(stats.symbols).slice(0, 10)
        },
        { upsert: true, session }
      )
      created++
    } catch (error) {
      console.error('Error creating daily P&L:', error)
    }
  }

  return created
}

/**
 * Execute data cleanup operation
 */
export async function executeCleanup(
  operationType: 'MANUAL' | 'AUTOMATED',
  triggeredBy?: string
): Promise<CleanupResult> {
  await connectDB()

  const session = await mongoose.startSession()
  
  // Create cleanup log
  const cleanupLog = await (DataCleanupLog as any).create([{
    operationType,
    operationStatus: 'SUCCESS',
    triggeredBy: triggeredBy ? new mongoose.Types.ObjectId(triggeredBy) : undefined,
    startedAt: new Date(),
    tradesProcessed: 0,
    ordersProcessed: 0,
    dailyPnLCreated: 0,
    details: {
      tradesArchived: 0,
      tradesDeleted: 0,
      ordersArchived: 0,
      ordersDeleted: 0
    }
  }], { session })

  const logId = cleanupLog[0]._id.toString()

  try {
    session.startTransaction()

    // Calculate cutoff dates
    const tradesCutoff = new Date()
    tradesCutoff.setDate(tradesCutoff.getDate() - 30)
    tradesCutoff.setHours(0, 0, 0, 0)

    const ordersCutoff = new Date()
    ordersCutoff.setDate(ordersCutoff.getDate() - 60)
    ordersCutoff.setHours(0, 0, 0, 0)

    // Step 1: Get eligible trades (older than 30 days, not same day)
    const eligibleTrades = await (Trade as any).find({
      createdAt: { $lt: tradesCutoff }
    }).session(session)

    let dailyPnLCreated = 0
    let tradesProcessed = 0

    if (eligibleTrades.length > 0) {
      // Create daily P&L summaries before archiving
      dailyPnLCreated = await createDailyPnLSummaries(eligibleTrades, session)

      // Archive trades
      const archivedTrades = eligibleTrades.map((trade: any) => ({
        originalTradeId: trade._id,
        originalOrderId: trade.orderId,
        userId: trade.userId,
        symbol: trade.symbol,
        type: trade.type,
        quantity: trade.quantity,
        price: trade.price,
        total: trade.total,
        originalCreatedAt: trade.createdAt,
        archivedAt: new Date()
      }))

      await (ArchivedTrade as any).insertMany(archivedTrades, { session })

      // Delete original trades
      await (Trade as any).deleteMany({
        _id: { $in: eligibleTrades.map((t: any) => t._id) }
      }, { session })

      tradesProcessed = eligibleTrades.length
    }

    // Step 2: Get eligible orders (older than 60 days, completed only)
    const eligibleOrders = await (Order as any).find({
      status: { $in: ['FILLED', 'CANCELLED'] },
      $or: [
        { filledAt: { $exists: true, $lt: ordersCutoff } },
        { cancelledAt: { $exists: true, $lt: ordersCutoff } }
      ]
    }).session(session)

    let ordersProcessed = 0

    if (eligibleOrders.length > 0) {
      // Archive orders
      const archivedOrders = eligibleOrders.map((order: any) => ({
        originalOrderId: order._id,
        userId: order.userId,
        symbol: order.symbol,
        type: order.type,
        orderType: order.orderType,
        productType: order.productType,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        filledQuantity: order.filledQuantity,
        avgFillPrice: order.avgFillPrice,
        originalCreatedAt: order.createdAt,
        filledAt: order.filledAt,
        cancelledAt: order.cancelledAt,
        archivedAt: new Date()
      }))

      await (ArchivedOrder as any).insertMany(archivedOrders, { session })

      // Delete original orders
      await (Order as any).deleteMany({
        _id: { $in: eligibleOrders.map((o: any) => o._id) }
      }, { session })

      ordersProcessed = eligibleOrders.length
    }

    // Update cleanup log
    await (DataCleanupLog as any).findByIdAndUpdate(
      cleanupLog[0]._id,
      {
        operationStatus: 'SUCCESS',
        completedAt: new Date(),
        tradesProcessed,
        ordersProcessed,
        dailyPnLCreated,
        oldestRecordDate: eligibleTrades[0]?.createdAt || eligibleOrders[0]?.createdAt,
        newestRecordDate: eligibleTrades[eligibleTrades.length - 1]?.createdAt || 
                          eligibleOrders[eligibleOrders.length - 1]?.createdAt,
        details: {
          tradesArchived: tradesProcessed,
          tradesDeleted: tradesProcessed,
          ordersArchived: ordersProcessed,
          ordersDeleted: ordersProcessed
        }
      },
      { session }
    )

    await session.commitTransaction()

    return {
      success: true,
      stats: {
        tradesProcessed,
        ordersProcessed,
        dailyPnLCreated,
        tradesArchived: tradesProcessed,
        tradesDeleted: tradesProcessed,
        ordersArchived: ordersProcessed,
        ordersDeleted: ordersProcessed
      },
      logId
    }

  } catch (error) {
    await session.abortTransaction()
    
    // Update log with error
    await (DataCleanupLog as any).findByIdAndUpdate(cleanupLog[0]._id, {
      operationStatus: 'FAILED',
      completedAt: new Date(),
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      stats: {
        tradesProcessed: 0,
        ordersProcessed: 0,
        dailyPnLCreated: 0,
        tradesArchived: 0,
        tradesDeleted: 0,
        ordersArchived: 0,
        ordersDeleted: 0
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      logId
    }
  } finally {
    session.endSession()
  }
}

/**
 * Get cleanup operation logs
 */
export async function getCleanupLogs(limit: number = 20) {
  await connectDB()
  
  return await (DataCleanupLog as any)
    .find({})
    .sort({ startedAt: -1 })
    .limit(limit)
    .populate('triggeredBy', 'name email')
    .lean()
}