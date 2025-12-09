import mongoose, { Schema, Document } from 'mongoose'

export interface IHolding extends Document {
  userId: mongoose.Types.ObjectId
  symbol: string
  quantity: number
  avgPrice: number
  productType: 'INTRADAY' | 'DELIVERY'
  createdAt: Date
  updatedAt: Date
}

const HoldingSchema = new Schema<IHolding>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
    quantity: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    productType: { type: String, enum: ['INTRADAY', 'DELIVERY'], default: 'DELIVERY' },
  },
  { timestamps: true }
)

HoldingSchema.index({ userId: 1, symbol: 1, productType: 1 }, { unique: true })

export default mongoose.models.Holding || mongoose.model<IHolding>('Holding', HoldingSchema)
