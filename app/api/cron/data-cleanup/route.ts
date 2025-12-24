import { NextResponse } from 'next/server'
import { executeCleanup } from '@/lib/dataManagement'

export async function GET(req: Request) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting automated data cleanup...')
    
    const result = await executeCleanup('AUTOMATED')
    
    if (result.success) {
      console.log('Automated cleanup completed successfully:', result.stats)
      return NextResponse.json({
        success: true,
        message: 'Data cleanup completed successfully',
        stats: result.stats,
        logId: result.logId
      })
    } else {
      console.error('Automated cleanup failed:', result.error)
      return NextResponse.json({
        success: false,
        message: 'Data cleanup failed',
        error: result.error,
        logId: result.logId
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Cron cleanup error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to execute automated cleanup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}