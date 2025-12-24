import mongoose, { Schema, Document } from 'mongoose'

export interface IDailyPnL extends Document {
  userId: mongoose.Types.ObjectId
  date: Date
  totalTrades: number
  totalVolume: number
  realizedPnL: number
  topSymbols: string[]
  createdAt: Date
}

const DailyPnLSchema = new Schema<IDailyPnL>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    totalTrades: { type: Number, required: true, default: 0 },
    totalVolume: { type: Number, required: true, default: 0 },
    realizedPnL: { type: Number, required: true, default: 0 },
    topSymbols: [{ type: String, uppercase: true }],
  },
  { timestamps: true }
)

DailyPnLSchema.index({ userId: 1, date: -1 }, { unique: true })
DailyPnLSchema.index({ date: -1 })

export default mongoose.models.DailyPnL || mongoose.model<IDailyPnL>('DailyPnL', DailyPnLSchema)