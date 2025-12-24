import mongoose, { Schema, Document } from 'mongoose'

export interface IArchivedTrade extends Document {
  originalTradeId: mongoose.Types.ObjectId
  originalOrderId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  total: number
  originalCreatedAt: Date
  archivedAt: Date
}

const ArchivedTradeSchema = new Schema<IArchivedTrade>(
  {
    originalTradeId: { type: Schema.Types.ObjectId, required: true },
    originalOrderId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    originalCreatedAt: { type: Date, required: true },
    archivedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

ArchivedTradeSchema.index({ userId: 1, originalCreatedAt: -1 })
ArchivedTradeSchema.index({ symbol: 1, originalCreatedAt: -1 })
ArchivedTradeSchema.index({ archivedAt: 1 })

export default mongoose.models.ArchivedTrade || mongoose.model<IArchivedTrade>('ArchivedTrade', ArchivedTradeSchema)