import { connectDB } from './db'
import Subscription from '@/models/Subscription'
import PaymentSubmission from '@/models/PaymentSubmission'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export interface SubscriptionStatus {
  isActive: boolean
  status: 'INACTIVE' | 'PENDING' | 'ACTIVE' | 'EXPIRED'
  expiresAt?: Date
  daysRemaining?: number
}

/**
 * Check if user has active subscription
 */
export async function checkSubscriptionStatus(userId?: string): Promise<SubscriptionStatus> {
  try {
    await connectDB()
    
    let actualUserId = userId
    if (!actualUserId) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
        return { isActive: false, status: 'INACTIVE' }
      }
      // Get user ID from session email
      const User = (await import('@/models/User')).default
      const user = await (User as any).findOne({ email: session.user.email })
      if (!user) {
        return { isActive: false, status: 'INACTIVE' }
      }
      actualUserId = user._id.toString()
    }

    const subscription = await (Subscription as any).findOne({ userId: actualUserId })
    
    if (!subscription) {
      return { isActive: false, status: 'INACTIVE' }
    }

    // Check if subscription has expired
    if (subscription.status === 'ACTIVE' && subscription.expiresAt) {
      const now = new Date()
      if (now > subscription.expiresAt) {
        // Auto-expire subscription
        subscription.status = 'EXPIRED'
        await subscription.save()
        return { 
          isActive: false, 
          status: 'EXPIRED',
          expiresAt: subscription.expiresAt
        }
      }

      // Calculate days remaining
      const daysRemaining = Math.ceil(
        (subscription.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      return {
        isActive: true,
        status: 'ACTIVE',
        expiresAt: subscription.expiresAt,
        daysRemaining
      }
    }

    return {
      isActive: subscription.status === 'ACTIVE',
      status: subscription.status,
      expiresAt: subscription.expiresAt || undefined
    }
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return { isActive: false, status: 'INACTIVE' }
  }
}

/**
 * Activate subscription for user
 */
export async function activateSubscription(
  userId: string, 
  paymentSubmissionId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB()

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await (Subscription as any).findOneAndUpdate(
      { userId },
      {
        userId,
        status: 'ACTIVE',
        activatedAt: now,
        expiresAt,
        paymentSubmissionId
      },
      { upsert: true, new: true }
    )

    return { success: true, message: 'Subscription activated successfully' }
  } catch (error) {
    console.error('Error activating subscription:', error)
    return { success: false, message: 'Failed to activate subscription' }
  }
}

/**
 * Deactivate subscription
 */
export async function deactivateSubscription(userId: string): Promise<void> {
  try {
    await connectDB()
    await (Subscription as any).findOneAndUpdate(
      { userId },
      { status: 'EXPIRED' }
    )
  } catch (error) {
    console.error('Error deactivating subscription:', error)
  }
}

/**
 * Get subscription statistics for admin
 */
export async function getSubscriptionStats() {
  try {
    await connectDB()

    const [activeCount, pendingCount, expiredCount, totalRevenue] = await Promise.all([
      Subscription.countDocuments({ status: 'ACTIVE' }),
      Subscription.countDocuments({ status: 'PENDING' }),
      Subscription.countDocuments({ status: 'EXPIRED' }),
      PaymentSubmission.countDocuments({ status: 'APPROVED' })
    ])

    return {
      activeSubscribers: activeCount,
      pendingApprovals: pendingCount,
      expiredSubscriptions: expiredCount,
      totalRevenue: totalRevenue * 39, // ₹39 per subscription
      monthlyRevenue: activeCount * 39
    }
  } catch (error) {
    console.error('Error getting subscription stats:', error)
    return {
      activeSubscribers: 0,
      pendingApprovals: 0,
      expiredSubscriptions: 0,
      totalRevenue: 0,
      monthlyRevenue: 0
    }
  }
}