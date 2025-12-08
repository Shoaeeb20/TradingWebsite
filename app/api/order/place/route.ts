import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { placeOrder } from '@/lib/tradingEngine'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const payload = await req.json()
    const result = await placeOrder(user._id.toString(), payload)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error('Order placement error:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}
