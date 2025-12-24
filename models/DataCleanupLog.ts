import mongoose, { Schema, Document } from 'mongoose'

export interface IDataCleanupLog extends Document {
  operationType: 'MANUAL' | 'AUTOMATED'
  operationStatus: 'SUCCESS' | 'FAILED' | 'PARTIAL'
  triggeredBy?: mongoose.Types.ObjectId
  startedAt: Date
  completedAt?: Date
  tradesProcessed: number
  ordersProcessed: number
  dailyPnLCreated: number
  oldestRecordDate?: Date
  newestRecordDate?: Date
  errorMessage?: string
  details: {
    tradesArchived: number
    tradesDeleted: number
    ordersArchived: number
    ordersDeleted: number
  }
}

const DataCleanupLogSchema = new Schema<IDataCleanupLog>(
  {
    operationType: { type: String, enum: ['MANUAL', 'AUTOMATED'], required: true },
    operationStatus: { type: String, enum: ['SUCCESS', 'FAILED', 'PARTIAL'], required: true },
    triggeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date },
    tradesProcessed: { type: Number, default: 0 },
    ordersProcessed: { type: Number, default: 0 },
    dailyPnLCreated: { type: Number, default: 0 },
    oldestRecordDate: { type: Date },
    newestRecordDate: { type: Date },
    errorMessage: { type: String },
    details: {
      tradesArchived: { type: Number, default: 0 },
      tradesDeleted: { type: Number, default: 0 },
      ordersArchived: { type: Number, default: 0 },
      ordersDeleted: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

DataCleanupLogSchema.index({ startedAt: -1 })
DataCleanupLogSchema.index({ operationType: 1, operationStatus: 1 })

export default mongoose.models.DataCleanupLog || mongoose.model<IDataCleanupLog>('DataCleanupLog', DataCleanupLogSchema)