import mongoose, { Schema, Document } from 'mongoose'

export interface IAlgoRun extends Document {
  userId: mongoose.Types.ObjectId
  strategyId: mongoose.Types.ObjectId
  strategyType: 'MA_CROSSOVER'
  executionType: 'CRON' | 'MANUAL'
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED'
  reason?: string // Why skipped/failed
  marketStatus: {
    isOpen: boolean
    message?: string
  }
  symbolsProcessed: string[]
  signalsGenerated: Array<{
    symbol: string
    signal: 'BUY' | 'SELL' | 'HOLD'
    shortMA: number
    longMA: number
    price: number
    action: 'ORDER_PLACED' | 'NO_ACTION' | 'ERROR'
    orderId?: string
    error?: string
  }>
  executionTime: number // milliseconds
  createdAt: Date
}

const AlgoRunSchema = new Schema<IAlgoRun>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    strategyId: { type: Schema.Types.ObjectId, ref: 'AlgoStrategy', required: true },
    strategyType: { type: String, enum: ['MA_CROSSOVER'], required: true },
    executionType: { type: String, enum: ['CRON', 'MANUAL'], required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED', 'SKIPPED'], required: true },
    reason: String,
    marketStatus: {
      isOpen: { type: Boolean, required: true },
      message: String
    },
    symbolsProcessed: [String],
    signalsGenerated: [{
      symbol: { type: String, required: true },
      signal: { type: String, enum: ['BUY', 'SELL', 'HOLD'], required: true },
      shortMA: { type: Number, required: true },
      longMA: { type: Number, required: true },
      price: { type: Number, required: true },
      action: { type: String, enum: ['ORDER_PLACED', 'NO_ACTION', 'ERROR'], required: true },
      orderId: String,
      error: String
    }],
    executionTime: { type: Number, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

AlgoRunSchema.index({ userId: 1, createdAt: -1 })
AlgoRunSchema.index({ strategyId: 1, createdAt: -1 })
AlgoRunSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.AlgoRun || mongoose.model<IAlgoRun>('AlgoRun', AlgoRunSchema)