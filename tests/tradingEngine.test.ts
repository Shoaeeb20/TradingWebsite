import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { connectDB } from '../lib/db'
import { placeOrder, cancelOrder } from '../lib/tradingEngine'
import User from '../models/User'
import Stock from '../models/Stock'
import Order from '../models/Order'
import Holding from '../models/Holding'
import mongoose from 'mongoose'

describe('Trading Engine', () => {
  let testUserId: string
  let testSymbol = 'TESTSTOCK'

  beforeAll(async () => {
    await connectDB()

    const user = await (User as any).create({
      email: 'test@test.com',
      name: 'Test User',
      balance: 100000,
    })
    testUserId = user._id.toString()

    await (Stock as any).create({
      symbol: testSymbol,
      name: 'Test Stock Ltd',
      exchange: 'NSE',
      active: true,
    })
  })

  afterAll(async () => {
    await (User as any).deleteMany({ email: 'test@test.com' })
    await (Stock as any).deleteMany({ symbol: testSymbol })
    await (Order as any).deleteMany({ userId: testUserId })
    await (Holding as any).deleteMany({ userId: testUserId })
    await mongoose.connection.close()
  })

  it('should validate quantity as positive integer', async () => {
    const result = await placeOrder(testUserId, {
      symbol: testSymbol,
      type: 'BUY',
      orderType: 'MARKET',
      productType: 'DELIVERY',
      quantity: -5,
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('positive integer')
  })

  it('should require price for limit orders', async () => {
    const result = await placeOrder(testUserId, {
      symbol: testSymbol,
      type: 'BUY',
      orderType: 'LIMIT',
      productType: 'DELIVERY',
      quantity: 10,
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('valid price')
  })

  it('should reject orders for non-existent stocks', async () => {
    const result = await placeOrder(testUserId, {
      symbol: 'NONEXISTENT',
      type: 'BUY',
      orderType: 'MARKET',
      productType: 'DELIVERY',
      quantity: 10,
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('not found')
  })

  it('should place limit order successfully', async () => {
    const result = await placeOrder(testUserId, {
      symbol: testSymbol,
      type: 'BUY',
      orderType: 'LIMIT',
      productType: 'DELIVERY',
      quantity: 10,
      price: 100,
    })

    expect(result.success).toBe(true)
    expect(result.orderId).toBeDefined()
  })

  it('should cancel pending order', async () => {
    const placeResult = await placeOrder(testUserId, {
      symbol: testSymbol,
      type: 'BUY',
      orderType: 'LIMIT',
      productType: 'DELIVERY',
      quantity: 10,
      price: 100,
    })

    const cancelResult = await cancelOrder(testUserId, placeResult.orderId!)

    expect(cancelResult.success).toBe(true)
  })

  it('should reject sell order without holdings', async () => {
    const result = await placeOrder(testUserId, {
      symbol: testSymbol,
      type: 'SELL',
      orderType: 'MARKET',
      productType: 'DELIVERY',
      quantity: 10,
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Insufficient holdings')
  })
})
