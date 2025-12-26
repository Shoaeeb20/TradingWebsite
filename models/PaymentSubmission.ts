import mongoose, { Schema, Document } from 'mongoose'

export interface IPaymentSubmission extends Document {
  userId: string
  email: string
  subscriptionType: 'TRADE_IDEAS' | 'ALGO_TRADING' // New field to track which subscription type
  paymentApp: 'GOOGLE_PAY' | 'PHONEPE'
  paymentDate: Date
  userUpiId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  adminNotes?: string
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

const PaymentSubmissionSchema = new Schema<IPaymentSubmission>(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    subscriptionType: { 
      type: String, 
      required: true, 
      enum: ['TRADE_IDEAS', 'ALGO_TRADING'],
      default: 'TRADE_IDEAS' // Backward compatibility
    },
    paymentApp: { 
      type: String, 
      required: true, 
      enum: ['GOOGLE_PAY', 'PHONEPE'] 
    },
    paymentDate: { type: Date, required: true },
    userUpiId: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    adminNotes: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: String }
  },
  { timestamps: true }
)

PaymentSubmissionSchema.index({ userId: 1 })
PaymentSubmissionSchema.index({ status: 1 })
PaymentSubmissionSchema.index({ submittedAt: -1 })

export default mongoose.models.PaymentSubmission || 
  mongoose.model<IPaymentSubmission>('PaymentSubmission', PaymentSubmissionSchema)