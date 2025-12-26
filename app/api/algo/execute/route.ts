import { NextResponse } from 'next/server'
import { executeAllMAStrategies } from '@/lib/algo/movingAverageEngine'

export async function GET(req: Request) {
  try {
    // Verify cron secret for security
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting automated algo trading execution...')
    
    const result = await executeAllMAStrategies()
    
    if (result.success) {
      console.log('Algo trading execution completed successfully:', {
        usersProcessed: result.usersProcessed,
        totalOrders: result.totalOrders
      })
      
      return NextResponse.json({
        success: true,
        message: 'Algo trading execution completed successfully',
        data: {
          usersProcessed: result.usersProcessed,
          totalOrders: result.totalOrders,
          timestamp: new Date().toISOString()
        }
      })
    } else {
      console.error('Algo trading execution completed with errors:', result.errors)
      
      return NextResponse.json({
        success: false,
        message: 'Algo trading execution completed with errors',
        data: {
          usersProcessed: result.usersProcessed,
          totalOrders: result.totalOrders,
          errors: result.errors,
          timestamp: new Date().toISOString()
        }
      }, { status: 207 }) // 207 Multi-Status for partial success
    }
  } catch (error) {
    console.error('Cron algo execution error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to execute algo trading',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await executeAllMAStrategies()
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Manual algo execution completed' : 'Manual algo execution completed with errors',
      data: {
        usersProcessed: result.usersProcessed,
        totalOrders: result.totalOrders,
        errors: result.errors,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to execute manual algo trading',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}