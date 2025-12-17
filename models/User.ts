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
    provider: { type: String, default: 'credentials' },
  },
  { timestamps: true }
)

UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
