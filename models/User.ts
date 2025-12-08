import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  password?: string
  balance: number
  provider?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    password: { type: String },
    balance: { type: Number, default: 100000 },
    provider: { type: String, default: 'credentials' },
  },
  { timestamps: true }
)

UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
