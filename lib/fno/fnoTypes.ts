// F&O Trading Types - Completely separate from stock trading
export type FnoIndex = 'NIFTY' | 'BANKNIFTY'
export type OptionType = 'CE' | 'PE'
export type FnoAction = 'BUY' | 'SELL'

export interface FnoContract {
  index: FnoIndex
  strike: number
  optionType: OptionType
  expiry: Date
}

export interface FnoPosition {
  _id?: string
  userId: string
  contract: FnoContract
  quantity: number // Positive for long, negative for short
  avgPrice: number
  currentPrice?: number
  pnl?: number
  createdAt: Date
  isExpired: boolean
  isSettled: boolean
}

export interface FnoTrade {
  userId: string
  contract: FnoContract
  action: FnoAction
  quantity: number
  price: number
  timestamp: Date
}

export interface SpotPrice {
  symbol: string
  price: number
  timestamp: Date
}

export interface FnoQuote {
  contract: FnoContract
  price: number
  spotPrice: number
}

// Cache structure for in-memory spot prices
export interface SpotCache {
  NIFTY: { price: number; timestamp: number } | null
  BANKNIFTY: { price: number; timestamp: number } | null
}

// Strike price generation
export interface StrikeRange {
  strikes: number[]
  atm: number
}