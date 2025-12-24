import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCleanupStats } from '@/lib/dataManagement'
import { ADMIN_EMAILS } from '@/lib/adminConfig'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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