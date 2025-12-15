import mongoose from 'mongoose'

const PriceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
})

// TTL index - automatically delete documents older than 5 minutes
PriceSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 300 })

export default mongoose.models.Price || mongoose.model('Price', PriceSchema)