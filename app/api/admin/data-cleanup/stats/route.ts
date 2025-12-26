import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/adminConfig'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Dynamic import to avoid build-time issues
    const { getCleanupStats } = await import('@/lib/dataManagement')
    
    const stats = await getCleanupStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Cleanup stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cleanup statistics' },
      { status: 500 }
    )
  }
}