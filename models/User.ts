import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  password?: string
  balance: number // Cash balance for stocks
  fnoBalance: number // Separate F&O balance
  initialCapital: number // Starting capital for ROI calculation
  totalTopUps: number // Sum of all money added
  totalWithdrawals: number // Sum of all money withdrawn
  firstTradeBonus?: boolean // Track if first trade bonus was awarded
  lastAchievementCheck?: {
    totalTrades: number
    totalProfit: number
    daysSinceJoined: number
    hasFirstTrade: boolean
  } // Track last achievement check state
  lastAchievementCheckDate?: Date // When achievements were last checked
  activeChallenges?: {
    challengeId: string
    joinedAt: Date
    progress: number
  }[] // Track active social challenges
  provider?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    password: { type: String },
    balance: { type: Number, default: 100000 }, // Cash balance for stocks
    fnoBalance: { type: Number, default: 100000 }, // Separate F&O balance
    initialCapital: { type: Number, default: 200000 }, // Starting capital (balance + fnoBalance)
    totalTopUps: { type: Number, default: 0 }, // Sum of all money added
    totalWithdrawals: { type: Number, default: 0 }, // Sum of all money withdrawn
    firstTradeBonus: { type: Boolean, default: false }, // Track if first trade bonus was awarded
    lastAchievementCheck: {
      totalTrades: { type: Number, default: 0 },
      totalProfit: { type: Number, default: 0 },
      daysSinceJoined: { type: Number, default: 0 },
      hasFirstTrade: { type: Boolean, default: false }
    }, // Track last achievement check state
    lastAchievementCheckDate: { type: Date }, // When achievements were last checked
    activeChallenges: [{
      challengeId: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now },
      progress: { type: Number, default: 0 }
    }], // Track active social challenges
    provider: { type: String, default: 'credentials' },
  },
  { timestamps: true }
)

UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
