import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { executeCleanup } from '@/lib/dataManagement'
import { ADMIN_EMAILS } from '@/lib/adminConfig'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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