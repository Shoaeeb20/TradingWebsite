import mongoose from 'mongoose'
import { connectDB } from './db'
import Order from '@/models/Order'
import Trade from '@/models/Trade'
import Holding from '@/models/Holding'
import User from '@/models/User'
import Stock from '@/models/Stock'

import { isMarketOpen } from './marketHours'
// NEW: Import cached price functions
import { getCachedPrice } from './priceCache'

export interface OrderPayload {
  symbol: string
  type: 'BUY' | 'SELL'
  orderType: 'MARKET' | 'LIMIT'
  productType: 'INTRADAY' | 'DELIVERY'
  quantity: number
  price?: number
}

export interface OrderResult {
  success: boolean
  orderId?: string
  message?: string
  filled?: number
  avgPrice?: number
}

async function validateOrder(
  userId: string,
  payload: OrderPayload
): Promise<{ valid: boolean; error?: string }> {
  const { symbol, type, orderType, quantity, price, productType } = payload

  if (quantity <= 0 || !Number.isInteger(quantity)) {
    return { valid: false, error: 'Quantity must be a positive integer' }
  }

  if (orderType === 'LIMIT' && (!price || price <= 0)) {
    return { valid: false, error: 'Limit orders require a valid price' }
  }

  const stock = await (Stock as any).findOne({ symbol })
  if (!stock) {
    return { valid: false, error: 'Stock not found' }
  }

  const user = await (User as any).findById(userId)
  if (!user) {
    return { valid: false, error: 'User not found' }
  }

  if (type === 'BUY') {
    // Check if covering a short position
    const holding = await (Holding as any).findOne({ userId, symbol, productType })
    const isCoveringShort = holding && holding.quantity < 0

    // Calculate estimated cost for balance validation
    let estimatedCost: number
    if (orderType === 'MARKET') {
      // NEW CODE (Cached Prices)
      const cachedPrice = await getCachedPrice(symbol)
      if (!cachedPrice) {
        return { valid: false, error: 'Unable to fetch current price' }
      }
      estimatedCost = cachedPrice * quantity
    } else {
      estimatedCost = price! * quantity
    }

    // Always check balance - both for new positions and short covering
    if (user.balance < estimatedCost) {
      if (isCoveringShort) {
        return { valid: false, error: 'Insufficient balance to cover short position' }
      } else {
        return { valid: false, error: 'Insufficient balance' }
      }
    }
  }

  if (type === 'SELL') {
    // Block delivery short selling
    if (productType === 'DELIVERY') {
      const holding = await (Holding as any).findOne({ userId, symbol, productType: 'DELIVERY' })
      if (!holding || holding.quantity < quantity) {
        return {
          valid: false,
          error: 'Insufficient delivery holdings. Short selling only allowed for intraday.',
        }
      }
    }
    // Intraday short selling allowed (no validation needed)
  }

  return { valid: true }
}

export async function placeOrder(userId: string, payload: OrderPayload): Promise<OrderResult> {
  await connectDB()

  const marketStatus = isMarketOpen()
  if (!marketStatus.open && payload.orderType === 'MARKET') {
    return { success: false, message: marketStatus.message || 'Market is closed' }
  }

  const validation = await validateOrder(userId, payload)
  if (!validation.valid) {
    return { success: false, message: validation.error }
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const order = await (Order as any).create(
      [
        {
          userId,
          symbol: payload.symbol,
          type: payload.type,
          orderType: payload.orderType,
          productType: payload.productType,
          quantity: payload.quantity,
          price: payload.price,
          status: 'PENDING',
        },
      ],
      { session }
    )

    const orderId = order[0]._id.toString()

    if (payload.orderType === 'MARKET') {
      const fillResult = await fillMarketOrder(orderId, session)

      if (fillResult.success) {
        await session.commitTransaction()
        return {
          success: true,
          orderId,
          filled: fillResult.filled,
          avgPrice: fillResult.avgPrice,
          message: 'Order filled successfully',
        }
      } else {
        await (Order as any).findByIdAndUpdate(
          orderId,
          { status: 'CANCELLED', cancelledAt: new Date() },
          { session }
        )
        await session.commitTransaction()
        return { success: false, message: fillResult.message || 'Failed to fill order' }
      }
    }

    await session.commitTransaction()
    return {
      success: true,
      orderId,
      message: 'Limit order placed successfully',
    }
  } catch (error) {
    await session.abortTransaction()
    console.error('Order placement error:', error)
    return { success: false, message: 'Failed to place order' }
  } finally {
    session.endSession()
  }
}

async function fillMarketOrder(
  orderId: string,
  session: mongoose.ClientSession
): Promise<OrderResult> {
  const order = await (Order as any).findById(orderId).session(session)
  if (!order) {
    return { success: false, message: 'Order not found' }
  }

  // OLD CODE (Direct Yahoo API) - REMOVE AFTER TESTING
  // const quote = await fetchQuote(order.symbol)
  // if (!quote) {
  //   return { success: false, message: 'Unable to fetch market price' }
  // }
  // const fillPrice = quote.price

  // NEW CODE (Cached Prices)
  const cachedPrice = await getCachedPrice(order.symbol)
  if (!cachedPrice) {
    return { success: false, message: 'Unable to fetch market price' }
  }
  const fillPrice = cachedPrice
  const totalCost = fillPrice * order.quantity

  const user = await (User as any).findById(order.userId).session(session)
  if (!user) {
    return { success: false, message: 'User not found' }
  }

  if (order.type === 'BUY') {
    const holding = await (Holding as any)
      .findOne({ userId: order.userId, symbol: order.symbol, productType: order.productType })
      .session(session)
    const isCoveringShort = holding && holding.quantity < 0

    if (!isCoveringShort) {
      // Regular BUY: Deduct full amount from balance
      if (user.balance < totalCost) {
        return { success: false, message: 'Insufficient balance' }
      }
      user.balance -= totalCost
      await user.save({ session })
    }

    if (holding) {
      if (holding.quantity < 0) {
        // Covering short position: Pay full cost and settle P&L
        user.balance -= totalCost
        await user.save({ session })

        holding.quantity += order.quantity
        if (holding.quantity === 0) {
          await (Holding as any).deleteOne({ _id: holding._id }).session(session)
        } else {
          await holding.save({ session })
        }
      } else {
        // Adding to long position
        const newQuantity = holding.quantity + order.quantity
        const newAvgPrice =
          (holding.avgPrice * holding.quantity + fillPrice * order.quantity) / newQuantity
        holding.quantity = newQuantity
        holding.avgPrice = newAvgPrice
        await holding.save({ session })
      }
    } else {
      // New long position
      await (Holding as any).create(
        [
          {
            userId: order.userId,
            symbol: order.symbol,
            quantity: order.quantity,
            avgPrice: fillPrice,
            productType: order.productType,
          },
        ],
        { session }
      )
    }
  } else {
    // SELL order
    const holding = await (Holding as any)
      .findOne({ userId: order.userId, symbol: order.symbol, productType: order.productType })
      .session(session)

    if (holding) {
      // Selling existing long position: Add proceeds to balance
      user.balance += totalCost
      await user.save({ session })

      holding.quantity -= order.quantity
      if (holding.quantity === 0) {
        await (Holding as any).deleteOne({ _id: holding._id }).session(session)
      } else {
        await holding.save({ session })
      }
    } else {
      // No position - creating short position (intraday only)
      if (order.productType === 'INTRADAY') {
        // Short sell: Credit proceeds to balance and create negative holding
        user.balance += totalCost
        await user.save({ session })

        await (Holding as any).create(
          [
            {
              userId: order.userId,
              symbol: order.symbol,
              quantity: -order.quantity,
              avgPrice: fillPrice,
              productType: order.productType,
            },
          ],
          { session }
        )
      } else {
        return { success: false, message: 'Insufficient delivery holdings' }
      }
    }
  }

  await (Trade as any).create(
    [
      {
        orderId: order._id,
        userId: order.userId,
        symbol: order.symbol,
        type: order.type,
        quantity: order.quantity,
        price: fillPrice,
        total: totalCost,
      },
    ],
    { session }
  )

  order.status = 'FILLED'
  order.filledQuantity = order.quantity
  order.avgFillPrice = fillPrice
  order.filledAt = new Date()
  await order.save({ session })

  return { success: true, filled: order.quantity, avgPrice: fillPrice }
}

export async function matchLimitOrders(symbol: string): Promise<number> {
  await connectDB()

  // OLD CODE (Direct Yahoo API) - REMOVE AFTER TESTING
  // const quote = await fetchQuote(symbol)
  // if (!quote) return 0
  // const currentPrice = quote.price

  // NEW CODE (Cached Prices)
  const cachedPrice = await getCachedPrice(symbol)
  if (!cachedPrice) return 0
  const currentPrice = cachedPrice
  let matchedCount = 0

  const buyOrders = await (Order as any)
    .find({
      symbol,
      type: 'BUY',
      orderType: 'LIMIT',
      status: 'PENDING',
      price: { $gte: currentPrice },
    })
    .sort({ price: -1, createdAt: 1 })
  const sellOrders = await (Order as any)
    .find({
      symbol,
      type: 'SELL',
      orderType: 'LIMIT',
      status: 'PENDING',
      price: { $lte: currentPrice },
    })
    .sort({ price: 1, createdAt: 1 })

  for (const order of buyOrders) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const result = await fillLimitOrder(order._id.toString(), currentPrice, session)
      if (result.success) {
        matchedCount++
        await session.commitTransaction()
      } else {
        await session.abortTransaction()
      }
    } catch (error) {
      await session.abortTransaction()
      console.error('Error matching buy order:', error)
    } finally {
      session.endSession()
    }
  }

  for (const order of sellOrders) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const result = await fillLimitOrder(order._id.toString(), currentPrice, session)
      if (result.success) {
        matchedCount++
        await session.commitTransaction()
      } else {
        await session.abortTransaction()
      }
    } catch (error) {
      await session.abortTransaction()
      console.error('Error matching sell order:', error)
    } finally {
      session.endSession()
    }
  }

  return matchedCount
}

async function fillLimitOrder(
  orderId: string,
  fillPrice: number,
  session: mongoose.ClientSession
): Promise<OrderResult> {
  const order = await (Order as any).findById(orderId).session(session)
  if (!order || order.status !== 'PENDING') {
    return { success: false, message: 'Order not eligible for fill' }
  }

  const totalCost = fillPrice * order.quantity

  const user = await (User as any).findById(order.userId).session(session)
  if (!user) {
    return { success: false, message: 'User not found' }
  }

  if (order.type === 'BUY') {
    const holding = await (Holding as any)
      .findOne({ userId: order.userId, symbol: order.symbol, productType: order.productType })
      .session(session)
    const isCoveringShort = holding && holding.quantity < 0

    if (!isCoveringShort) {
      // Regular BUY: Check and deduct full amount from balance
      if (user.balance < totalCost) {
        order.status = 'CANCELLED'
        order.cancelledAt = new Date()
        await order.save({ session })
        return { success: false, message: 'Insufficient balance' }
      }
      user.balance -= totalCost
      await user.save({ session })
    }

    if (holding) {
      if (holding.quantity < 0) {
        // Covering short position: Pay full cost and settle P&L
        user.balance -= totalCost
        await user.save({ session })

        holding.quantity += order.quantity
        if (holding.quantity === 0) {
          await (Holding as any).deleteOne({ _id: holding._id }).session(session)
        } else {
          await holding.save({ session })
        }
      } else {
        // Adding to long position
        const newQuantity = holding.quantity + order.quantity
        const newAvgPrice =
          (holding.avgPrice * holding.quantity + fillPrice * order.quantity) / newQuantity
        holding.quantity = newQuantity
        holding.avgPrice = newAvgPrice
        await holding.save({ session })
      }
    } else {
      // New long position
      await (Holding as any).create(
        [
          {
            userId: order.userId,
            symbol: order.symbol,
            quantity: order.quantity,
            avgPrice: fillPrice,
            productType: order.productType,
          },
        ],
        { session }
      )
    }
  } else {
    // SELL order (limit)
    const holding = await (Holding as any)
      .findOne({ userId: order.userId, symbol: order.symbol, productType: order.productType })
      .session(session)

    if (holding) {
      // Selling existing long position: Add proceeds to balance
      user.balance += totalCost
      await user.save({ session })

      holding.quantity -= order.quantity
      if (holding.quantity === 0) {
        await (Holding as any).deleteOne({ _id: holding._id }).session(session)
      } else {
        await holding.save({ session })
      }
    } else {
      // No position - creating short position (intraday only)
      if (order.productType === 'INTRADAY') {
        // Short sell: Credit proceeds to balance and create negative holding
        user.balance += totalCost
        await user.save({ session })

        await (Holding as any).create(
          [
            {
              userId: order.userId,
              symbol: order.symbol,
              quantity: -order.quantity,
              avgPrice: fillPrice,
              productType: order.productType,
            },
          ],
          { session }
        )
      } else {
        order.status = 'CANCELLED'
        order.cancelledAt = new Date()
        await order.save({ session })
        return { success: false, message: 'Insufficient delivery holdings' }
      }
    }
  }

  await (Trade as any).create(
    [
      {
        orderId: order._id,
        userId: order.userId,
        symbol: order.symbol,
        type: order.type,
        quantity: order.quantity,
        price: fillPrice,
        total: totalCost,
      },
    ],
    { session }
  )

  order.status = 'FILLED'
  order.filledQuantity = order.quantity
  order.avgFillPrice = fillPrice
  order.filledAt = new Date()
  await order.save({ session })

  return { success: true, filled: order.quantity, avgPrice: fillPrice }
}

export async function cancelOrder(userId: string, orderId: string): Promise<OrderResult> {
  await connectDB()

  const order = await (Order as any).findOne({ _id: orderId, userId })
  if (!order) {
    return { success: false, message: 'Order not found' }
  }

  if (order.status !== 'PENDING') {
    return { success: false, message: 'Only pending orders can be cancelled' }
  }

  order.status = 'CANCELLED'
  order.cancelledAt = new Date()
  await order.save()

  return { success: true, message: 'Order cancelled successfully' }
}
