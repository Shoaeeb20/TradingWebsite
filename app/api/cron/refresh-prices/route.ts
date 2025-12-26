import { NextRequest, NextResponse } from 'next/server'
import { refreshAllPrices, refreshEssentialPrices } from '@/lib/priceCache'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    console.log('Refresh Prices Auth Debug:', {
      receivedAuthHeader: authHeader,
      expectedAuthHeader: `Bearer ${cronSecret}`,
      cronSecret: cronSecret,
      headersMatch: authHeader === `Bearer ${cronSecret}`,
      receivedHeaderLength: authHeader?.length,
      expectedHeaderLength: cronSecret ? `Bearer ${cronSecret}`.length : 0
    })
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        debug: {
          receivedHeader: authHeader ? `${authHeader.substring(0, 10)}...` : 'null',
          expectedFormat: 'Bearer <secret>',
          secretLength: cronSecret?.length || 0
        }
      }, { status: 401 })
    }
    
    console.log('Starting scheduled price refresh...')
    
    // Use fast refresh for cron jobs to avoid timeouts
    const result = await Promise.race([
      refreshEssentialPrices(), // Use faster function for cron
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Cron job timeout')), 25000) // 25 second timeout
      )
    ]) as { success: number; failed: number }
    
    return NextResponse.json({
      message: 'Price refresh completed',
      success: result.success,
      failed: result.failed,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Price refresh cron error:', error)
    
    if (error instanceof Error && error.message === 'Cron job timeout') {
      return NextResponse.json(
        { 
          error: 'Price refresh timed out', 
          message: 'Partial refresh may have completed',
          timestamp: new Date().toISOString()
        },
        { status: 408 } // Request Timeout
      )
    }
    
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