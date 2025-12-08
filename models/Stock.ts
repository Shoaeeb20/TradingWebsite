import mongoose, { Schema, Document } from 'mongoose'

export interface IStock extends Document {
  symbol: string
  name: string
  exchange: string
  sector?: string
  industry?: string
  marketCap?: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const StockSchema = new Schema<IStock>(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    exchange: { type: String, default: 'NSE' },
    sector: { type: String },
    industry: { type: String },
    marketCap: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

StockSchema.index({ symbol: 1 })
StockSchema.index({ sector: 1 })
StockSchema.index({ active: 1 })

export default mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema)
