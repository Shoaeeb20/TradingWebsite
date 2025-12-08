import mongoose, { Schema, Document } from 'mongoose'

export interface IPrice extends Document {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: Date
  expiresAt: Date
}

const PriceSchema = new Schema<IPrice>({
  symbol: { type: String, required: true, uppercase: true },
  price: { type: Number, required: true },
  change: { type: Number, required: true },
  changePercent: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
})

PriceSchema.index({ symbol: 1 })
PriceSchema.index({ expiresAt: 1 })

export default mongoose.models.Price || mongoose.model<IPrice>('Price', PriceSchema)
