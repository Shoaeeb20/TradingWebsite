import mongoose, { Schema, Document } from 'mongoose'

export interface IAlgoStrategy extends Document {
  userId: mongoose.Types.ObjectId
  strategyType: 'MA_CROSSOVER'
  isActive: boolean
  symbols: string[] // Stocks to trade
  parameters: {
    shortMA: number // Default: 20
    longMA: number  // Default: 50
    quantity: number // Shares per trade
  }
  lastRun?: Date
  lastSignal?: {
    symbol: string
    signal: 'BUY' | 'SELL' | 'HOLD'
    timestamp: Date
    shortMA: number
    longMA: number
    price: number
  }
  performance: {
    totalTrades: number
    winningTrades: number
    totalPnL: number
    currentPositions: number
  }
  createdAt: Date
  updatedAt: Date
}

const AlgoStrategySchema = new Schema<IAlgoStrategy>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    strategyType: { type: String, enum: ['MA_CROSSOVER'], default: 'MA_CROSSOVER' },
    isActive: { type: Boolean, default: false },
    symbols: [{ type: String, uppercase: true }],
    parameters: {
      shortMA: { type: Number, default: 20, min: 5, max: 50 },
      longMA: { type: Number, default: 50, min: 20, max: 200 },
      quantity: { type: Number, default: 1, min: 1, max: 1000 }
    },
    lastRun: { type: Date },
    lastSignal: {
      symbol: String,
      signal: { type: String, enum: ['BUY', 'SELL', 'HOLD'] },
      timestamp: Date,
      shortMA: Number,
      longMA: Number,
      price: Number
    },
    performance: {
      totalTrades: { type: Number, default: 0 },
      winningTrades: { type: Number, default: 0 },
      totalPnL: { type: Number, default: 0 },
      currentPositions: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
)

AlgoStrategySchema.index({ userId: 1, strategyType: 1 }, { unique: true })
AlgoStrategySchema.index({ isActive: 1 })

export default mongoose.models.AlgoStrategy || mongoose.model<IAlgoStrategy>('AlgoStrategy', AlgoStrategySchema)