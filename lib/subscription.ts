import { connectDB } from './db'
import Subscription from '@/models/Subscription'
import PaymentSubmission from '@/models/PaymentSubmission'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export interface SubscriptionStatus {
  isActive: boolean
  status: 'INACTIVE' | 'PENDING' | 'ACTIVE' | 'EXPIRED'
  type?: 'TRADE_IDEAS' | 'ALGO_TRADING'
  expiresAt?: Date
  daysRemaining?: number
}

export interface SubscriptionDetails {
  tradeIdeas: SubscriptionStatus
  algoTrading: SubscriptionStatus
}

/**
 * Check if user has active subscription (backward compatible - checks trade ideas by default)
 */
export async function checkSubscriptionStatus(userId?: string): Promise<SubscriptionStatus> {
  return await checkSpecificSubscription(userId, 'TRADE_IDEAS')
}

/**
 * Check specific subscription type
 */
export async function checkSpecificSubscription(
  userId?: string, 
  subscriptionType: 'TRADE_IDEAS' | 'ALGO_TRADING' = 'TRADE_IDEAS'
): Promise<SubscriptionStatus> {
  try {
    await connectDB()
    
    let actualUserId = userId
    if (!actualUserId) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
        return { isActive: false, status: 'INACTIVE', type: subscriptionType }
      }
      // Get user ID from session email
      const User = (await import('@/models/User')).default
      const user = await (User as any).findOne({ email: session.user.email })
      if (!user) {
        return { isActive: false, status: 'INACTIVE', type: subscriptionType }
      }
      actualUserId = user._id.toString()
      
      // Check if user is admin (gets all access) - but only for trade ideas, not algo trading
      if (user.email === 'oshoaeeb@gmail.com' && subscriptionType === 'TRADE_IDEAS') {
        return {
          isActive: true,
          status: 'ACTIVE',
          type: subscriptionType
        }
      }
    } else {
      // If userId is provided, check if it's admin - but only for trade ideas, not algo trading
      const User = (await import('@/models/User')).default
      const user = await (User as any).findById(actualUserId)
      if (user?.email === 'oshoaeeb@gmail.com' && subscriptionType === 'TRADE_IDEAS') {
        return {
          isActive: true,
          status: 'ACTIVE',
          type: subscriptionType
        }
      }
    }

    const subscription = await (Subscription as any).findOne({ 
      userId: actualUserId, 
      type: subscriptionType 
    })
    
    console.log('Subscription check:', {
      userId: actualUserId,
      subscriptionType,
      foundSubscription: subscription ? {
        id: subscription._id,
        type: subscription.type,
        status: subscription.status,
        expiresAt: subscription.expiresAt
      } : null
    })
    
    if (!subscription) {
      return { isActive: false, status: 'INACTIVE', type: subscriptionType }
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
          type: subscriptionType,
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
        type: subscriptionType,
        expiresAt: subscription.expiresAt,
        daysRemaining
      }
    }

    return {
      isActive: subscription.status === 'ACTIVE',
      status: subscription.status,
      type: subscriptionType,
      expiresAt: subscription.expiresAt || undefined
    }
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return { isActive: false, status: 'INACTIVE', type: subscriptionType }
  }
}

/**
 * Get all subscription details for a user
 */
export async function getAllSubscriptions(userId?: string): Promise<SubscriptionDetails> {
  const [tradeIdeas, algoTrading] = await Promise.all([
    checkSpecificSubscription(userId, 'TRADE_IDEAS'),
    checkSpecificSubscription(userId, 'ALGO_TRADING')
  ])

  return { tradeIdeas, algoTrading }
}

/**
 * Activate subscription for user
 */
export async function activateSubscription(
  userId: string, 
  paymentSubmissionId: string,
  subscriptionType: 'TRADE_IDEAS' | 'ALGO_TRADING' = 'TRADE_IDEAS'
): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB()

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await (Subscription as any).findOneAndUpdate(
      { userId, type: subscriptionType },
      {
        userId,
        type: subscriptionType,
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
export async function deactivateSubscription(
  userId: string, 
  subscriptionType?: 'TRADE_IDEAS' | 'ALGO_TRADING'
): Promise<void> {
  try {
    await connectDB()
    
    if (subscriptionType) {
      // Deactivate specific subscription type
      await (Subscription as any).findOneAndUpdate(
        { userId, type: subscriptionType },
        { status: 'EXPIRED' }
      )
    } else {
      // Deactivate all subscriptions (backward compatibility)
      await (Subscription as any).updateMany(
        { userId },
        { status: 'EXPIRED' }
      )
    }
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

    const [
      tradeIdeasActive, tradeIdeasPending, tradeIdeasExpired,
      algoTradingActive, algoTradingPending, algoTradingExpired,
      tradeIdeasRevenue, algoTradingRevenue
    ] = await Promise.all([
      Subscription.countDocuments({ type: 'TRADE_IDEAS', status: 'ACTIVE' }),
      Subscription.countDocuments({ type: 'TRADE_IDEAS', status: 'PENDING' }),
      Subscription.countDocuments({ type: 'TRADE_IDEAS', status: 'EXPIRED' }),
      Subscription.countDocuments({ type: 'ALGO_TRADING', status: 'ACTIVE' }),
      Subscription.countDocuments({ type: 'ALGO_TRADING', status: 'PENDING' }),
      Subscription.countDocuments({ type: 'ALGO_TRADING', status: 'EXPIRED' }),
      PaymentSubmission.countDocuments({ subscriptionType: 'TRADE_IDEAS', status: 'APPROVED' }),
      PaymentSubmission.countDocuments({ subscriptionType: 'ALGO_TRADING', status: 'APPROVED' })
    ])

    return {
      tradeIdeas: {
        activeSubscribers: tradeIdeasActive,
        pendingApprovals: tradeIdeasPending,
        expiredSubscriptions: tradeIdeasExpired,
        totalRevenue: tradeIdeasRevenue * 39,
        monthlyRevenue: tradeIdeasActive * 39
      },
      algoTrading: {
        activeSubscribers: algoTradingActive,
        pendingApprovals: algoTradingPending,
        expiredSubscriptions: algoTradingExpired,
        totalRevenue: algoTradingRevenue * 199,
        monthlyRevenue: algoTradingActive * 199
      },
      total: {
        activeSubscribers: tradeIdeasActive + algoTradingActive,
        pendingApprovals: tradeIdeasPending + algoTradingPending,
        expiredSubscriptions: tradeIdeasExpired + algoTradingExpired,
        totalRevenue: (tradeIdeasRevenue * 39) + (algoTradingRevenue * 199),
        monthlyRevenue: (tradeIdeasActive * 39) + (algoTradingActive * 199)
      }
    }
  } catch (error) {
    console.error('Error getting subscription stats:', error)
    return {
      tradeIdeas: {
        activeSubscribers: 0,
        pendingApprovals: 0,
        expiredSubscriptions: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
      },
      algoTrading: {
        activeSubscribers: 0,
        pendingApprovals: 0,
        expiredSubscriptions: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
      },
      total: {
        activeSubscribers: 0,
        pendingApprovals: 0,
        expiredSubscriptions: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
      }
    }
  }
}