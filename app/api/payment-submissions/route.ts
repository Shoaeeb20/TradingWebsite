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

    // Parse JSON data first
    const { paymentApp, paymentDate, userUpiId, subscriptionType = 'TRADE_IDEAS', amount } = await request.json()

    // Check if user already has pending submission for this subscription type
    const existingPending = await (PaymentSubmission as any).findOne({
      userId,
      subscriptionType,
      status: 'PENDING'
    })

    if (existingPending) {
      return NextResponse.json(
        { 
          success: false, 
          error: `You already have a pending ${subscriptionType} payment submission. Please wait for approval.` 
        },
        { status: 400 }
      )
    }

    // Validate subscription type
    const validSubscriptionTypes = ['TRADE_IDEAS', 'ALGO_TRADING']
    if (!validSubscriptionTypes.includes(subscriptionType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription type' },
        { status: 400 }
      )
    }

    // Validate amount based on subscription type
    const expectedAmount = subscriptionType === 'ALGO_TRADING' ? 199 : 39
    if (amount && amount !== expectedAmount) {
      return NextResponse.json(
        { success: false, error: `Invalid amount. Expected ₹${expectedAmount} for ${subscriptionType}` },
        { status: 400 }
      )
    }

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
      subscriptionType,
      paymentApp,
      paymentDate: new Date(paymentDate),
      userUpiId,
      status: 'PENDING',
      submittedAt: new Date()
    })

    // Update or create subscription status to PENDING
    try {
      await (Subscription as any).findOneAndUpdate(
        { 
          userId: userId, 
          type: subscriptionType 
        },
        { 
          $set: {
            userId: userId,
            type: subscriptionType,
            status: 'PENDING',
            paymentSubmissionId: submission._id.toString()
          }
        },
        { 
          upsert: true,
          new: true
        }
      )
    } catch (duplicateError: any) {
      // If there's a duplicate key error, try to update existing subscription
      if (duplicateError.code === 11000) {
        // Find existing subscription and update it
        const existingSubscription = await (Subscription as any).findOne({ userId: userId })
        if (existingSubscription) {
          // Update the existing subscription to the new type
          existingSubscription.type = subscriptionType
          existingSubscription.status = 'PENDING'
          existingSubscription.paymentSubmissionId = submission._id.toString()
          await existingSubscription.save()
        }
      } else {
        throw duplicateError
      }
    }

    return NextResponse.json({
      success: true,
      message: `${subscriptionType} payment submission received. Please send screenshot to WhatsApp +91 9330255340. Approval takes 24-48 hours.`,
      data: {
        submissionId: submission._id.toString(),
        subscriptionType,
        amount: expectedAmount,
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