import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import PaymentSubmission from '@/models/PaymentSubmission'
import Subscription from '@/models/Subscription'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Get user
    const user = await (User as any).findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = user._id.toString()

    // Check if user already has pending submission
    const existingPending = await (PaymentSubmission as any).findOne({
      userId,
      status: 'PENDING'
    })

    if (existingPending) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You already have a pending payment submission. Please wait for approval.' 
        },
        { status: 400 }
      )
    }

    // Parse JSON data
    const { paymentApp, paymentDate, userUpiId } = await request.json()

    // Validate required fields
    if (!paymentApp || !paymentDate || !userUpiId) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate payment app
    if (!['GOOGLE_PAY', 'PHONEPE'].includes(paymentApp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment app. Only Google Pay or PhonePe allowed.' },
        { status: 400 }
      )
    }

    // Create payment submission
    const submission = await (PaymentSubmission as any).create({
      userId,
      email: session.user.email,
      paymentApp,
      paymentDate: new Date(paymentDate),
      userUpiId,
      status: 'PENDING',
      submittedAt: new Date()
    })

    // Update subscription status to PENDING
    await (Subscription as any).findOneAndUpdate(
      { userId },
      { 
        userId,
        status: 'PENDING',
        paymentSubmissionId: submission._id.toString()
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Payment submission received. Please send screenshot to WhatsApp +91 9330255340. Approval takes 24-48 hours.',
      data: {
        submissionId: submission._id.toString(),
        status: 'PENDING',
        whatsappNumber: '+91 9330255340'
      }
    })
  } catch (error) {
    console.error('Error submitting payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit payment' },
      { status: 500 }
    )
  }
}