import mongoose, { Schema, Document } from 'mongoose'

export interface ITradeIdea extends Document {
  title: string
  symbol: string
  type: 'EQUITY' | 'FNO'
  action: 'BUY' | 'SELL'
  entryPrice?: number
  targetPrice?: number
  stopLoss?: number
  quantity?: number
  rationale: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  timeHorizon: 'INTRADAY' | 'SHORT_TERM' | 'MEDIUM_TERM'
  createdBy: string
  createdAt: Date
  expiresAt: Date
  isActive: boolean
}

const TradeIdeaSchema = new Schema<ITradeIdea>(
  {
    title: { type: String, required: true, maxlength: 200 },
    symbol: { type: String, required: true, uppercase: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['EQUITY', 'FNO'] 
    },
    action: { 
      type: String, 
      required: true, 
      enum: ['BUY', 'SELL'] 
    },
    entryPrice: { type: Number, min: 0 },
    targetPrice: { type: Number, min: 0 },
    stopLoss: { type: Number, min: 0 },
    quantity: { type: Number, min: 1 },
    rationale: { type: String, required: true },
    riskLevel: { 
      type: String, 
      required: true, 
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },
    timeHorizon: { 
      type: String, 
      required: true, 
      enum: ['INTRADAY', 'SHORT_TERM', 'MEDIUM_TERM'],
      default: 'INTRADAY'
    },
    createdBy: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

TradeIdeaSchema.index({ isActive: 1, expiresAt: 1 })
TradeIdeaSchema.index({ type: 1 })
TradeIdeaSchema.index({ symbol: 1 })
TradeIdeaSchema.index({ createdAt: -1 })

export default mongoose.models.TradeIdea || 
  mongoose.model<ITradeIdea>('TradeIdea', TradeIdeaSchema)