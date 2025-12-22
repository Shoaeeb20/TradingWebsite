import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import PaymentSubmission from '@/models/PaymentSubmission'
import { activateSubscription } from '@/lib/subscription'
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
    submission.status = 'APPROVED'
    submission.reviewedAt = new Date()
    submission.reviewedBy = adminUserId
    submission.adminNotes = adminNotes
    await submission.save()

    // Activate subscription
    const activationResult = await activateSubscription(
      submission.userId,
      submissionId
    )

    if (!activationResult.success) {
      return NextResponse.json(
        { success: false, error: activationResult.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment approved and subscription activated',
      data: {
        submissionId,
        status: 'APPROVED'
      }
    })
  } catch (error) {
    console.error('Error approving payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve payment' },
      { status: 500 }
    )
  }
}