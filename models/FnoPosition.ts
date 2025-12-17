import mongoose from 'mongoose'

// F&O Position Schema - Completely separate from stock holdings
const FnoPositionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  contract: {
    index: {
      type: String,
      enum: ['NIFTY', 'BANKNIFTY'],
      required: true
    },
    strike: {
      type: Number,
      required: true
    },
    optionType: {
      type: String,
      enum: ['CE', 'PE'],
      required: true
    },
    expiry: {
      type: Date,
      required: true
    }
  },
  quantity: {
    type: Number,
    required: true
    // Positive for long positions, negative for short positions
  },
  avgPrice: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isExpired: {
    type: Boolean,
    default: false,
    index: true
  },
  isSettled: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
})

// Compound index for efficient position lookups
FnoPositionSchema.index({
  userId: 1,
  'contract.index': 1,
  'contract.strike': 1,
  'contract.optionType': 1,
  'contract.expiry': 1,
  isExpired: 1,
  isSettled: 1
})

// Index for cleanup of expired positions
FnoPositionSchema.index({
  isExpired: 1,
  createdAt: 1
})

const FnoPosition = mongoose.models.FnoPosition || mongoose.model('FnoPosition', FnoPositionSchema)

export default FnoPosition