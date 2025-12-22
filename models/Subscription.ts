import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscription extends Document {
  userId: string
  status: 'INACTIVE' | 'PENDING' | 'ACTIVE' | 'EXPIRED'
  activatedAt?: Date
  expiresAt?: Date
  paymentSubmissionId?: string
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, unique: true },
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

SubscriptionSchema.index({ userId: 1 })
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ expiresAt: 1 })

export default mongoose.models.Subscription || 
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema)