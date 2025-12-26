import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/adminConfig'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Dynamic import to avoid build-time issues
    const { connectDB } = await import('@/lib/db')
    const { executeCleanup } = await import('@/lib/dataManagement')
    const User = (await import('@/models/User')).default

    await connectDB()
    const user = await (User as any).findOne({ email: session.user.email })
    
    const result = await executeCleanup('MANUAL', user?._id?.toString())
    
    return NextResponse.json({
      success: result.success,
      data: result.stats,
      logId: result.logId,
      error: result.error
    })
  } catch (error) {
    console.error('Cleanup execution error:', error)
    return NextResponse.json(
      { error: 'Failed to execute cleanup operation' },
      { status: 500 }
    )
  }
}