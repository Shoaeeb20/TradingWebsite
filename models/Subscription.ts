import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscription extends Document {
  userId: string
  type: 'TRADE_IDEAS' | 'ALGO_TRADING' // New field for subscription tiers
  status: 'INACTIVE' | 'PENDING' | 'ACTIVE' | 'EXPIRED'
  activatedAt?: Date
  expiresAt?: Date
  paymentSubmissionId?: string
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['TRADE_IDEAS', 'ALGO_TRADING'],
      default: 'TRADE_IDEAS' // Backward compatibility - existing subscriptions default to trade ideas
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['INACTIVE', 'PENDING', 'ACTIVE', 'EXPIRED'],
      default: 'INACTIVE'
    },
    activatedAt: { type: Date },
    expiresAt: { type: Date },
    paymentSubmissionId: { type: String }
  },
  { timestamps: true }
)

SubscriptionSchema.index({ userId: 1, type: 1 }, { unique: true }) // Compound unique index
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ expiresAt: 1 })

export default mongoose.models.Subscription || 
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema)