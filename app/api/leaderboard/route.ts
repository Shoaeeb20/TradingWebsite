import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'
import { getCachedPrices } from '@/lib/priceCache'

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

    // Get total count for pagination
    const totalUsers = await (User as any).countDocuments(searchQuery)
    const totalPages = Math.ceil(totalUsers / limit)
    const skip = (page - 1) * limit

    // Get users with pagination
    const users = await (User as any)
      .find(searchQuery)
      .select('name email balance')
      .skip(skip)
      .limit(limit)
      .lean()

    // Get all holdings for these users
    const userIds = users.map((u: any) => u._id)
    const holdings = await (Holding as any)
      .find({ userId: { $in: userIds } })
      .lean()

    // Get unique symbols for price fetching
    const symbols = [...new Set(holdings.map((h: any) => h.symbol))]
    const prices = await getCachedPrices(symbols)

    // Calculate holdings value for each user
    const usersWithHoldings = users.map((user: any) => {
      const userHoldings = holdings.filter((h: any) => h.userId.toString() === user._id.toString())
      
      let holdingsValue = 0
      userHoldings.forEach((holding: any) => {
        const currentPrice = prices[holding.symbol] || holding.avgPrice
        holdingsValue += holding.quantity * currentPrice
      })

      return {
        name: user.name,
        email: user.email,
        balance: user.balance,
        holdingsValue,
        totalValue: user.balance + holdingsValue
      }
    })

    // Sort by total value (descending)
    usersWithHoldings.sort((a, b) => b.totalValue - a.totalValue)

    // Calculate global ranks
    const startRank = skip + 1
    const usersWithRanks = usersWithHoldings.map((user, index) => ({
      ...user,
      rank: startRank + index
    }))

    return NextResponse.json({
      users: usersWithRanks,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}