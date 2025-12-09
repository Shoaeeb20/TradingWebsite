import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Holding from '@/models/Holding'
import { placeOrder } from '@/lib/tradingEngine'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const intradayHoldings = await Holding.find({ productType: 'INTRADAY' })

    let squaredOff = 0
    const errors = []

    for (const holding of intradayHoldings) {
      try {
        const quantity = Math.abs(holding.quantity)
        const type = holding.quantity > 0 ? 'SELL' : 'BUY'

        const result = await placeOrder(holding.userId.toString(), {
          symbol: holding.symbol,
          type,
          orderType: 'MARKET',
          productType: 'INTRADAY',
          quantity,
        })

        if (result.success) {
          squaredOff++
        } else {
          errors.push(`${holding.symbol}: ${result.message}`)
        }
      } catch (error) {
        errors.push(`${holding.symbol}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      squaredOff,
      total: intradayHoldings.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Square-off error:', error)
    return NextResponse.json({ error: 'Failed to square off' }, { status: 500 })
  }
}
