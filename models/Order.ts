import mongoose, { Schema, Document } from 'mongoose'

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  symbol: string
  type: 'BUY' | 'SELL'
  orderType: 'MARKET' | 'LIMIT'
  productType: 'INTRADAY' | 'DELIVERY'
  quantity: number
  price?: number
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'PARTIAL'
  filledQuantity: number
  avgFillPrice?: number
  filledAt?: Date
  cancelledAt?: Date
  source?: string // Track order source (MANUAL, ALGO_MA_CROSSOVER, etc.)
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    orderType: { type: String, enum: ['MARKET', 'LIMIT'], required: true },
    productType: { type: String, enum: ['INTRADAY', 'DELIVERY'], default: 'DELIVERY' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'FILLED', 'CANCELLED', 'PARTIAL'],
      default: 'PENDING',
    },
    filledQuantity: { type: Number, default: 0 },
    avgFillPrice: { type: Number },
    filledAt: { type: Date },
    cancelledAt: { type: Date },
    source: { type: String, default: 'MANUAL' }, // Track order source
  },
  { timestamps: true }
)

OrderSchema.index({ userId: 1, createdAt: -1 })
OrderSchema.index({ symbol: 1, status: 1 })
OrderSchema.index({ status: 1, orderType: 1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
