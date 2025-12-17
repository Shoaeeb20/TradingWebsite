import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, balanceType } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    if (!['EQUITY', 'FNO'].includes(balanceType)) {
      return NextResponse.json({ error: 'Invalid balance type' }, { status: 400 })
    }

    await connectDB()

    const updateField = balanceType === 'EQUITY' ? 'balance' : 'fnoBalance'
    
    const user = await (User as any).findOneAndUpdate(
      { email: session.user.email },
      { 
        $inc: { 
          [updateField]: amount,
          totalTopUps: amount 
        } 
      },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      balance: user.balance,
      fnoBalance: user.fnoBalance,
      message: `₹${amount.toLocaleString('en-IN')} added to ${balanceType} balance`
    })
  } catch (error) {
    console.error('Top-up error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}