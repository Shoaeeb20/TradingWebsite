import { FnoTrade, FnoPosition, FnoContract } from './fnoTypes'
import { calculateOptionPrice, getSettlementPrice, isExpired } from './fnoPricing'
import { getSpotPrices } from './fnoCache'
import { isMarketOpen } from './marketHours'
import { 
  calculateFnoClosingPnL, 
  calculateFnoAveragePrice, 
  validateFnoBalance 
} from './fnoPnlCalculator'
import FnoPositionModel from '../../models/FnoPosition'
import User from '../../models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'

/**
 * Execute F&O trade - completely separate from stock trading engine
 * Market orders only, instant execution
 */
export async function executeFnoTrade(trade: FnoTrade): Promise<{
  success: boolean
  message: string
  position?: FnoPosition
}> {
  try {
    // Check market hours
    const marketStatus = isMarketOpen()
    if (!marketStatus.open) {
      return { success: false, message: marketStatus.message || 'Market is closed' }
    }

    // Check if contract is expired before execution
    if (isExpired(trade.contract.expiry)) {
      return { success: false, message: 'Contract expired' }
    }

    // Get current spot prices
    const spotPrices = await getSpotPrices()
    const spotPrice = spotPrices[trade.contract.index]

    if (!spotPrice) {
      return { success: false, message: 'Unable to fetch spot price' }
    }

    // Calculate option price
    const optionPrice = calculateOptionPrice(trade.contract, spotPrice)

    // Get user by email since userId is not ObjectId
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, message: 'Session not found' }
    }

    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return { success: false, message: 'User not found' }
    }

    // Ensure fnoBalance exists for existing users
    if (user.fnoBalance === undefined) {
      await (User as any).findByIdAndUpdate(user._id, { fnoBalance: 100000 })
      user.fnoBalance = 100000
    }

    // Use actual MongoDB _id for database operations
    const actualUserId = user._id.toString()

    // Calculate trade value and validate balance
    const tradeValue = optionPrice * trade.quantity
    const isBuy = trade.action === 'BUY'
    const isShort = !isBuy

    // Validate balance for both BUY and SELL orders
    const balanceValidation = validateFnoBalance(user.fnoBalance, optionPrice, trade.quantity, isShort)
    if (!balanceValidation.valid) {
      return { success: false, message: balanceValidation.error! }
    }

    // Find existing position
    const existingPosition = await (FnoPositionModel as any).findOne({
      userId: actualUserId,
      'contract.index': trade.contract.index,
      'contract.strike': trade.contract.strike,
      'contract.optionType': trade.contract.optionType,
      'contract.expiry': trade.contract.expiry,
      isExpired: false,
    })

    let finalPosition: FnoPosition

    if (existingPosition) {
      // Update existing position
      const currentQty = existingPosition.quantity
      const newQty = isBuy ? currentQty + trade.quantity : currentQty - trade.quantity

      if (newQty === 0) {
        // Position fully closed - calculate and credit P&L only
        const pnlResult = calculateFnoClosingPnL(
          existingPosition.avgPrice,
          optionPrice,
          currentQty
        )

        await (User as any).findByIdAndUpdate(actualUserId, {
          $inc: { fnoBalance: pnlResult.balanceChange },
        })

        await FnoPositionModel.deleteOne({ _id: existingPosition._id })

        return { 
          success: true, 
          message: `Position closed successfully. P&L: ₹${pnlResult.pnl.toFixed(2)}` 
        }
      } else if (Math.sign(currentQty) !== Math.sign(newQty)) {
        // Position reversed (e.g., long 10 -> sell 15 = short 5)
        // Close existing position first, then open new opposite position
        const closePnl = calculateFnoClosingPnL(
          existingPosition.avgPrice,
          optionPrice,
          currentQty
        )

        // Update balance with closing P&L
        await (User as any).findByIdAndUpdate(actualUserId, {
          $inc: { fnoBalance: closePnl.balanceChange },
        })

        // Create new opposite position
        existingPosition.quantity = newQty
        existingPosition.avgPrice = optionPrice
        await existingPosition.save()

        finalPosition = existingPosition.toObject()
      } else {
        // Adding to existing position (same direction)
        const newAvgPrice = calculateFnoAveragePrice(
          existingPosition.avgPrice,
          currentQty,
          optionPrice,
          isBuy ? trade.quantity : -trade.quantity
        )

        existingPosition.quantity = newQty
        existingPosition.avgPrice = newAvgPrice
        await existingPosition.save()

        finalPosition = existingPosition.toObject()
      }
    } else {
      // Create new position
      const newPosition = new FnoPositionModel({
        userId: actualUserId,
        contract: trade.contract,
        quantity: isBuy ? trade.quantity : -trade.quantity,
        avgPrice: optionPrice,
        createdAt: new Date(),
        isExpired: false,
      })

      await newPosition.save()
      finalPosition = newPosition.toObject()
    }

    // Update F&O balance based on trade type
    if (isBuy) {
      // Long position: debit full premium
      await (User as any).findByIdAndUpdate(actualUserId, {
        $inc: { fnoBalance: -tradeValue },
      })
    } else {
      // Short position: credit premium received, debit margin
      const marginRequired = balanceValidation.required
      await (User as any).findByIdAndUpdate(actualUserId, {
        $inc: { fnoBalance: tradeValue - marginRequired },
      })
    }

    return {
      success: true,
      message: 'Trade executed successfully',
      position: finalPosition,
    }
  } catch (error) {
    console.error('F&O trade execution failed:', error)
    return { success: false, message: 'Trade execution failed' }
  }
}

/**
 * Get user F&O positions with current P&L
 * Auto-expires positions and cleans up database
 */
export async function getUserFnoPositions(): Promise<FnoPosition[]> {
  try {
    // Get user by session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return []

    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) return []

    const actualUserId = user._id.toString()

    // Get all non-expired, non-settled positions
    const positions = await (FnoPositionModel as any)
      .find({
        userId: actualUserId,
        isExpired: false,
        isSettled: false,
      })
      .lean()

    if (positions.length === 0) return []

    // Get current spot prices
    const spotPrices = await getSpotPrices()

    const activePositions: FnoPosition[] = []
    const expiredPositions: any[] = []

    for (const position of positions) {
      const contract = position.contract as FnoContract
      const spotPrice = spotPrices[contract.index]

      if (!spotPrice) {
        continue // Skip if spot price unavailable
      }

      // Check if expired
      if (isExpired(contract.expiry)) {
        // Mark as expired and calculate settlement using shared calculator
        const settlementPrice = getSettlementPrice(contract, spotPrice)
        const pnlResult = calculateFnoClosingPnL(
          position.avgPrice,
          settlementPrice,
          position.quantity
        )

        expiredPositions.push({
          positionId: position._id,
          pnl: pnlResult.balanceChange,
        })
      } else {
        // Active position - calculate current P&L using shared calculator
        const currentPrice = calculateOptionPrice(contract, spotPrice)
        const pnlResult = calculateFnoClosingPnL(
          position.avgPrice,
          currentPrice,
          position.quantity
        )

        activePositions.push({
          ...position,
          currentPrice,
          pnl: pnlResult.pnl,
        } as FnoPosition)
      }
    }

    // Handle expired positions
    if (expiredPositions.length > 0) {
      const totalPnl = expiredPositions.reduce((sum, pos) => sum + pos.pnl, 0)

      // Update F&O balance with settlement P&L
      await (User as any).findByIdAndUpdate(actualUserId, {
        $inc: { fnoBalance: totalPnl },
      })

      // Mark positions as expired and settled (idempotent)
      await FnoPositionModel.updateMany(
        { _id: { $in: expiredPositions.map((p) => p.positionId) } },
        { isExpired: true, isSettled: true }
      )
    }

    return activePositions
  } catch (error) {
    console.error('Failed to get F&O positions:', error)
    return []
  }
}

/**
 * Close F&O position (market order) - bypasses market hours for paper trading
 */
export async function closeFnoPosition(
  positionId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Get user by session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, message: 'Session not found' }
    }

    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return { success: false, message: 'User not found' }
    }

    const actualUserId = user._id.toString()

    const position = await (FnoPositionModel as any).findOne({
      _id: positionId,
      userId: actualUserId,
      isExpired: false,
    })

    if (!position) {
      return { success: false, message: 'Position not found' }
    }

    // Check if contract is expired
    if (isExpired(position.contract.expiry)) {
      return { success: false, message: 'Contract expired' }
    }

    // Get current spot prices
    const spotPrices = await getSpotPrices()
    const spotPrice = spotPrices[position.contract.index]

    if (!spotPrice) {
      return { success: false, message: 'Unable to fetch spot price' }
    }

    // Calculate current option price
    const currentPrice = calculateOptionPrice(position.contract, spotPrice)

    // Calculate P&L using shared calculator
    const pnlResult = calculateFnoClosingPnL(
      position.avgPrice,
      currentPrice,
      position.quantity
    )

    // Update user F&O balance with P&L only (not original investment)
    await (User as any).findByIdAndUpdate(actualUserId, {
      $inc: { fnoBalance: pnlResult.balanceChange },
    })

    // Delete the position
    await FnoPositionModel.deleteOne({ _id: positionId })

    return { 
      success: true, 
      message: `Position closed successfully. P&L: ₹${pnlResult.pnl.toFixed(2)}` 
    }
  } catch (error) {
    console.error('Failed to close F&O position:', error)
    return { success: false, message: 'Failed to close position' }
  }
}
