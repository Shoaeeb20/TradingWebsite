import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Holding from '@/models/Holding'
import User from '@/models/User'
import Order from '@/models/Order'
import Trade from '@/models/Trade'
import { getCachedPrice } from '@/lib/priceCache'
import { calculateClosingPnL } from '@/lib/pnlCalculator'
import mongoose from 'mongoose'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get user from database by email (Google OAuth users)
    const user = await (User as any).findOne({
      email: session.user.email,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get only INTRADAY holdings for this user
    const intradayHoldings = await (Holding as any).find({
      userId: user._id,
      productType: 'INTRADAY',
    })

    if (intradayHoldings.length === 0) {
      return NextResponse.json({
        message: 'No intraday positions to square off',
        count: 0,
      })
    }

    let squaredOff = 0
    const errors: string[] = []

    for (const holding of intradayHoldings) {
      const mongoSession = await mongoose.startSession()
      mongoSession.startTransaction()

      try {
        const currentPrice = await getCachedPrice(holding.symbol)
        if (!currentPrice) {
          errors.push(`Failed to fetch price for ${holding.symbol}`)
          await mongoSession.abortTransaction()
          continue
        }

        const isShort = holding.quantity < 0
        const absQuantity = Math.abs(holding.quantity)
        const orderType = isShort ? 'BUY' : 'SELL'
        const totalAmount = currentPrice * absQuantity

        // Create square-off order
        const order = await (Order as any).create(
          [
            {
              userId: holding.userId,
              symbol: holding.symbol,
              type: orderType,
              orderType: 'MARKET',
              productType: 'INTRADAY',
              quantity: absQuantity,
              status: 'FILLED',
              filledQuantity: absQuantity,
              avgFillPrice: currentPrice,
              filledAt: new Date(),
            },
          ],
          { session: mongoSession }
        )

        // Create trade record
        await (Trade as any).create(
          [
            {
              orderId: order[0]._id,
              userId: holding.userId,
              symbol: holding.symbol,
              type: orderType,
              quantity: absQuantity,
              price: currentPrice,
              total: totalAmount,
            },
          ],
          { session: mongoSession }
        )

        // Update user balance using shared P&L calculator
        const user = await (User as any).findById(holding.userId).session(mongoSession)
        if (user) {
          const pnlResult = calculateClosingPnL(isShort, holding.avgPrice, currentPrice, absQuantity)
          user.balance += pnlResult.balanceChange
          await user.save({ session: mongoSession })
        }

        // Remove the holding
        await (Holding as any).deleteOne({ _id: holding._id }).session(mongoSession)

        await mongoSession.commitTransaction()
        squaredOff++
      } catch (error) {
        await mongoSession.abortTransaction()
        errors.push(`Error squaring off ${holding.symbol}: ${error}`)
      } finally {
        mongoSession.endSession()
      }
    }

    return NextResponse.json({
      message: `Successfully squared off ${squaredOff} intraday positions`,
      squaredOff,
      total: intradayHoldings.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Manual square-off error:', error)
    return NextResponse.json({ error: 'Square-off failed' }, { status: 500 })
  }
}
