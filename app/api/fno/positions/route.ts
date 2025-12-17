import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { connectDB } from '../../../../lib/db'
import { getUserFnoPositions } from '../../../../lib/fno/fnoEngine'
import { getSpotPrices } from '../../../../lib/fno/fnoCache'
import { generateStrikes, calculateOptionPrice } from '../../../../lib/fno/fnoPricing'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'quotes') {
      // Get option chain for trading interface
      const index = searchParams.get('index') as 'NIFTY' | 'BANKNIFTY'
      
      if (!index || !['NIFTY', 'BANKNIFTY'].includes(index)) {
        return NextResponse.json({ error: 'Invalid index' }, { status: 400 })
      }

      const spotPrices = await getSpotPrices()
      const spotPrice = spotPrices[index]
      const strikes = generateStrikes(index, spotPrice)

      // Generate option chain
      const optionChain = strikes.strikes.map(strike => ({
        strike,
        ce: {
          price: calculateOptionPrice({
            index,
            strike,
            optionType: 'CE',
            expiry: new Date() // Expiry not used in pricing
          }, spotPrice)
        },
        pe: {
          price: calculateOptionPrice({
            index,
            strike,
            optionType: 'PE',
            expiry: new Date()
          }, spotPrice)
        }
      }))

      return NextResponse.json({
        index,
        spotPrice,
        atm: strikes.atm,
        optionChain
      })
    }

    // Default: Get user positions
    const positions = await getUserFnoPositions()

    return NextResponse.json({
      positions,
      count: positions.length
    })

  } catch (error) {
    console.error('F&O positions API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}