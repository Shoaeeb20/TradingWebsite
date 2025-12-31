import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'
import FnoPosition from '@/models/FnoPosition'
import { getCachedPrices } from '@/lib/priceCache'
import { getSpotPrices } from '@/lib/fno/fnoCache'
import { calculateOptionPrice, isExpired } from '@/lib/fno/fnoPricing'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {}

    // Get ALL users matching search (no pagination yet)
    const allUsers = await (User as any)
      .find(searchQuery)
      .select('name email balance fnoBalance initialCapital totalTopUps totalWithdrawals')
      .lean()

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({
        users: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      })
    }

    // Get ALL holdings and F&O positions for all users
    const userIds = allUsers.map((u: any) => u._id.toString()) // Convert to string
    const holdings = await (Holding as any)
      .find({ userId: { $in: allUsers.map((u: any) => u._id) } })
      .lean()
    
    const fnoPositions = await (FnoPosition as any)
      .find({ 
        userId: { $in: allUsers.map((u: any) => u._id) },
        isExpired: false,
        isSettled: false
      })
      .lean()

    // Get unique symbols for price fetching
    const symbols = [...new Set(holdings.map((h: any) => h.symbol))] as string[]
    let prices: Record<string, number> = {}
    let spotPrices: Record<string, number> = {}
    
    try {
      prices = await getCachedPrices(symbols)
    } catch (error) {
      console.warn('Failed to fetch cached prices:', error)
      prices = {}
    }
    
    // Get F&O spot prices
    try {
      spotPrices = await getSpotPrices()
    } catch (error) {
      console.warn('Failed to fetch spot prices:', error)
      spotPrices = {}
    }

    // Calculate ROI for ALL users
    const usersWithReturns = allUsers.map((user: any) => {
      const userId = user._id.toString() // Convert ObjectId to string
      const userHoldings = holdings.filter((h: any) => h.userId.toString() === userId)
      const userFnoPositions = fnoPositions.filter((p: any) => p.userId.toString() === userId)
      
      // Calculate stock holdings value
      let holdingsValue = 0
      userHoldings.forEach((holding: any) => {
        const currentPrice = prices[holding.symbol]
        if (!currentPrice) {
          console.warn(`No price available for ${holding.symbol}, excluding from portfolio`)
          return
        }
        holdingsValue += holding.quantity * currentPrice
      })

      // Calculate F&O positions value (unrealized P&L)
      let fnoUnrealizedPnL = 0
      try {
        userFnoPositions.forEach((position: any) => {
          const contract = position.contract
          if (!contract || !contract.index) return
          
          const spotPrice = spotPrices[contract.index]
          
          if (!spotPrice || isExpired(contract.expiry)) {
            return // Skip if no price or expired
          }
          
          const currentPrice = calculateOptionPrice(contract, spotPrice)
          if (!currentPrice || isNaN(currentPrice)) return
          
          const isShort = position.quantity < 0
          
          if (isShort) {
            // Short position P&L: profit when price falls
            fnoUnrealizedPnL += (position.avgPrice - currentPrice) * Math.abs(position.quantity)
          } else {
            // Long position P&L: profit when price rises  
            fnoUnrealizedPnL += (currentPrice - position.avgPrice) * Math.abs(position.quantity)
          }
        })
      } catch (error) {
        console.warn('Error calculating F&O P&L for user:', userId, error)
        fnoUnrealizedPnL = 0
      }

      const equityBalance = user.balance || 0
      const fnoBalance = user.fnoBalance || 0
      const currentValue = equityBalance + fnoBalance + holdingsValue + fnoUnrealizedPnL
      
      // Calculate ROI
      const initialCapital = user.initialCapital || 200000
      const totalTopUps = user.totalTopUps || 0
      const totalWithdrawals = user.totalWithdrawals || 0
      const totalInvested = initialCapital + totalTopUps - totalWithdrawals
      
      const netPnL = currentValue - totalInvested
      const returnPercent = totalInvested > 0 ? (netPnL / totalInvested) * 100 : 0
      
      return {
        userId: userId, // Already converted to string
        name: user.name || 'Anonymous',
        email: user.email || '',
        balance: Number(equityBalance) || 0,
        fnoBalance: Number(fnoBalance) || 0,
        holdingsValue: Number(holdingsValue) || 0,
        fnoUnrealizedPnL: Number(fnoUnrealizedPnL) || 0,
        currentValue: Number(currentValue) || 0,
        totalInvested: Number(totalInvested) || 0,
        netPnL: Number(netPnL) || 0,
        returnPercent: Number(returnPercent) || 0
      }
    })

    // Sort ALL users by return percentage (descending) - skill-based ranking
    usersWithReturns.sort((a: any, b: any) => b.returnPercent - a.returnPercent)

    // Add correct global ranks
    const rankedUsers = usersWithReturns.map((user: any, index: number) => ({
      ...user,
      rank: index + 1
    }))

    // Now apply pagination to the correctly sorted and ranked results
    const totalUsers = rankedUsers.length
    const totalPages = Math.ceil(totalUsers / limit)
    const skip = (page - 1) * limit
    const paginatedUsers = rankedUsers.slice(skip, skip + limit)

    // Remove userId from response and ensure all values are serializable
    const responseUsers = paginatedUsers.map(({ userId, ...user }: any) => ({
      ...user,
      rank: Number(user.rank),
      name: String(user.name || 'Anonymous'),
      email: String(user.email || ''),
      balance: Number(user.balance || 0),
      fnoBalance: Number(user.fnoBalance || 0),
      holdingsValue: Number(user.holdingsValue || 0),
      fnoUnrealizedPnL: Number(user.fnoUnrealizedPnL || 0),
      currentValue: Number(user.currentValue || 0),
      totalInvested: Number(user.totalInvested || 0),
      netPnL: Number(user.netPnL || 0),
      returnPercent: Number(user.returnPercent || 0)
    }))

    return NextResponse.json({
      users: responseUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(totalUsers),
        totalPages: Number(totalPages),
        hasNext: Boolean(page < totalPages),
        hasPrev: Boolean(page > 1)
      }
    })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}