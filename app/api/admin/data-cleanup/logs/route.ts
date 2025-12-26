import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/adminConfig'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Dynamic import to avoid build-time issues
    const { getCleanupLogs } = await import('@/lib/dataManagement')
    
    const logs = await getCleanupLogs(limit)
    
    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error) {
    console.error('Cleanup logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cleanup logs' },
      { status: 500 }
    )
  }
}