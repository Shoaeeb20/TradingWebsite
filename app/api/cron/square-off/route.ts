import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Holding from '@/models/Holding'
import User from '@/models/User'
import Order from '@/models/Order'
import Trade from '@/models/Trade'
import { fetchQuote } from '@/lib/yahoo'
import mongoose from 'mongoose'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const intradayHoldings = await (Holding as any).find({ productType: 'INTRADAY' })

    if (intradayHoldings.length === 0) {
      return NextResponse.json({ message: 'No intraday positions to square off', count: 0 })
    }

    let squaredOff = 0
    const errors: string[] = []

    for (const holding of intradayHoldings) {
      const session = await mongoose.startSession()
      session.startTransaction()

      try {
        const quote = await fetchQuote(holding.symbol)
        if (!quote) {
          errors.push(`Failed to fetch price for ${holding.symbol}`)
          await session.abortTransaction()
          continue
        }

        const currentPrice = quote.price
        const isShort = holding.quantity < 0
        const absQuantity = Math.abs(holding.quantity)
        const orderType = isShort ? 'BUY' : 'SELL'
        const totalAmount = currentPrice * absQuantity

        const order = await (Order as any).create(
          [
            {
              userId: holding.userId,
              symbol: holding.symbol,
              type: orderType,
              orderType: 'MARKET',
              quantity: absQuantity,
              status: 'FILLED',
              filledQuantity: absQuantity,
              avgFillPrice: currentPrice,
              filledAt: new Date(),
            },
          ],
          { session }
        )

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
          { session }
        )

        const user = await (User as any).findById(holding.userId).session(session)
        if (user) {
          if (isShort) {
            user.balance -= totalAmount
          } else {
            user.balance += totalAmount
          }
          await user.save({ session })
        }

        await (Holding as any).deleteOne({ _id: holding._id }).session(session)

        await session.commitTransaction()
        squaredOff++
      } catch (error) {
        await session.abortTransaction()
        errors.push(`Error squaring off ${holding.symbol}: ${error}`)
      } finally {
        session.endSession()
      }
    }

    return NextResponse.json({
      message: 'Square-off completed',
      squaredOff,
      total: intradayHoldings.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Square-off error:', error)
    return NextResponse.json({ error: 'Square-off failed' }, { status: 500 })
  }
}
