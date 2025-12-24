import mongoose, { Schema, Document } from 'mongoose'

export interface IArchivedOrder extends Document {
  originalOrderId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  symbol: string
  type: 'BUY' | 'SELL'
  orderType: 'MARKET' | 'LIMIT'
  productType: 'INTRADAY' | 'DELIVERY'
  quantity: number
  price?: number
  status: 'FILLED' | 'CANCELLED'
  filledQuantity: number
  avgFillPrice?: number
  originalCreatedAt: Date
  filledAt?: Date
  cancelledAt?: Date
  archivedAt: Date
}

const ArchivedOrderSchema = new Schema<IArchivedOrder>(
  {
    originalOrderId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    orderType: { type: String, enum: ['MARKET', 'LIMIT'], required: true },
    productType: { type: String, enum: ['INTRADAY', 'DELIVERY'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, min: 0 },
    status: { type: String, enum: ['FILLED', 'CANCELLED'], required: true },
    filledQuantity: { type: Number, default: 0 },
    avgFillPrice: { type: Number },
    originalCreatedAt: { type: Date, required: true },
    filledAt: { type: Date },
    cancelledAt: { type: Date },
    archivedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

ArchivedOrderSchema.index({ userId: 1, originalCreatedAt: -1 })
ArchivedOrderSchema.index({ symbol: 1, status: 1 })
ArchivedOrderSchema.index({ archivedAt: 1 })

export default mongoose.models.ArchivedOrder || mongoose.model<IArchivedOrder>('ArchivedOrder', ArchivedOrderSchema)