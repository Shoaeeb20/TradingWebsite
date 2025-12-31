import { connectDB } from './db'
import Trade from '@/models/Trade'
import User from '@/models/User'

export interface UserProgress {
  hasFirstTrade: boolean
  totalTrades: number
  totalProfit: number
  joinedDate: Date
  daysSinceJoined: number
}

/**
 * Check if user has completed their first trade
 */
export async function checkFirstTrade(userEmail: string): Promise<boolean> {
  try {
    await connectDB()
    
    const user = await (User as any).findOne({ email: userEmail })
    if (!user) return false

    const firstTrade = await (Trade as any).findOne({ userId: user._id })
    return !!firstTrade
  } catch (error) {
    console.error('Error checking first trade:', error)
    return false
  }
}

/**
 * Get comprehensive user progress data
 */
export async function getUserProgress(userEmail: string): Promise<UserProgress | null> {
  try {
    await connectDB()
    
    const user = await (User as any).findOne({ email: userEmail })
    if (!user) return null

    const trades = await (Trade as any).find({ userId: user._id })
    const hasFirstTrade = trades.length > 0
    
    // Calculate total P&L
    const totalProfit = trades.reduce((sum: number, trade: any) => {
      return sum + (trade.pnl || 0)
    }, 0)

    // Calculate days since joined
    const joinedDate = new Date(user.createdAt)
    const daysSinceJoined = Math.floor(
      (Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      hasFirstTrade,
      totalTrades: trades.length,
      totalProfit,
      joinedDate,
      daysSinceJoined
    }
  } catch (error) {
    console.error('Error getting user progress:', error)
    return null
  }
}

/**
 * Award first trade bonus to user
 */
export async function awardFirstTradeBonus(userEmail: string): Promise<boolean> {
  try {
    await connectDB()
    
    const user = await (User as any).findOne({ email: userEmail })
    if (!user) return false

    // Check if bonus already awarded
    if (user.firstTradeBonus) return false

    // Award ₹10,000 bonus
    await (User as any).findByIdAndUpdate(user._id, {
      $inc: { balance: 10000 },
      $set: { firstTradeBonus: true }
    })

    return true
  } catch (error) {
    console.error('Error awarding first trade bonus:', error)
    return false
  }
}