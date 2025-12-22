import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import PaymentSubmission from '@/models/PaymentSubmission'
import Subscription from '@/models/Subscription'
import User from '@/models/User'

// Check if user is admin
async function isAdmin(email: string): Promise<boolean> {
  const adminEmails = ['admin@papertrade-india.com', 'oshoaeeb@gmail.com']
  return adminEmails.includes(email)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    await connectDB()

    const { adminNotes } = await request.json()
    const submissionId = params.id

    // Find and update payment submission
    const submission = await (PaymentSubmission as any).findById(submissionId)
    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Payment submission not found' },
        { status: 404 }
      )
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Payment submission already processed' },
        { status: 400 }
      )
    }

    // Get admin user ID
    const adminUser = await (User as any).findOne({ email: session.user.email })
    const adminUserId = adminUser?._id.toString()

    // Update submission status
    submission.status = 'REJECTED'
    submission.reviewedAt = new Date()
    submission.reviewedBy = adminUserId
    submission.adminNotes = adminNotes
    await submission.save()

    // Update subscription status back to INACTIVE
    await (Subscription as any).findOneAndUpdate(
      { userId: submission.userId },
      { status: 'INACTIVE' }
    )

    return NextResponse.json({
      success: true,
      message: 'Payment rejected',
      data: {
        submissionId,
        status: 'REJECTED'
      }
    })
  } catch (error) {
    console.error('Error rejecting payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reject payment' },
      { status: 500 }
    )
  }
}