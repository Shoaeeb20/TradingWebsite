import mongoose, { Schema, Document } from 'mongoose'

export interface ITrade extends Document {
  orderId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  total: number
  source?: string // Track trade source (MANUAL, ALGO_MA_CROSSOVER, etc.)
  createdAt: Date
}

const TradeSchema = new Schema<ITrade>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    source: { type: String, default: 'MANUAL' }, // Track trade source
  },
  { timestamps: true }
)

TradeSchema.index({ userId: 1, createdAt: -1 })
TradeSchema.index({ symbol: 1, createdAt: -1 })

export default mongoose.models.Trade || mongoose.model<ITrade>('Trade', TradeSchema)
