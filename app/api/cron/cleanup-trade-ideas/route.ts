import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import TradeIdea from '@/models/TradeIdea'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (you can add auth headers if needed)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Delete trade ideas older than 7 days from their expiry date
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const result = await (TradeIdea as any).deleteMany({
      expiresAt: { $lt: sevenDaysAgo }
    })

    console.log(`Cleanup completed: Deleted ${result.deletedCount} expired trade ideas`)

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} expired trade ideas`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Error cleaning up trade ideas:', error)
    return NextResponse.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Allow manual cleanup via POST as well
  return GET(request)
}