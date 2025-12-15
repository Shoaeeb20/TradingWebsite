import { NextRequest, NextResponse } from 'next/server'
import { refreshAllPrices } from '@/lib/priceCache'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('Starting scheduled price refresh...')
    const result = await refreshAllPrices()
    
    return NextResponse.json({
      message: 'Price refresh completed',
      success: result.success,
      failed: result.failed,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Price refresh cron error:', error)
    return NextResponse.json(
      { error: 'Price refresh failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}