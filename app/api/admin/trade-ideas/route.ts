import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import TradeIdea from '@/models/TradeIdea'
import User from '@/models/User'
import { isAdminEmail } from '@/lib/adminConfig'

// Check if user is admin
async function isAdmin(email: string): Promise<boolean> {
  return isAdminEmail(email)
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const tradeIdeas = await (TradeIdea as any).find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await TradeIdea.countDocuments()

    return NextResponse.json({
      success: true,
      data: {
        tradeIdeas,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching trade ideas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trade ideas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    await connectDB()

    const adminUser = await (User as any).findOne({ email: session.user.email })
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      )
    }

    const {
      title,
      symbol,
      type,
      action,
      entryPrice,
      targetPrice,
      stopLoss,
      quantity,
      rationale,
      riskLevel,
      timeHorizon,
      daysToExpire = 7
    } = await request.json()

    // Validate required fields
    if (!title || !symbol || !type || !action || !rationale) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate expiry date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysToExpire)

    const tradeIdea = await (TradeIdea as any).create({
      title,
      symbol: symbol.toUpperCase(),
      type,
      action,
      entryPrice: entryPrice || undefined,
      targetPrice: targetPrice || undefined,
      stopLoss: stopLoss || undefined,
      quantity: quantity || undefined,
      rationale,
      riskLevel: riskLevel || 'MEDIUM',
      timeHorizon: timeHorizon || 'INTRADAY',
      createdBy: adminUser._id.toString(),
      expiresAt,
      isActive: true
    })

    return NextResponse.json({
      success: true,
      message: 'Trade idea created successfully',
      data: tradeIdea
    })
  } catch (error) {
    console.error('Error creating trade idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create trade idea' },
      { status: 500 }
    )
  }
}