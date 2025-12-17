import { FnoContract, FnoIndex, StrikeRange } from './fnoTypes'

// Time values for different indices (fixed to keep pricing simple)
const TIME_VALUES = {
  NIFTY: 20,
  BANKNIFTY: 30
}

// Strike intervals
const STRIKE_INTERVALS = {
  NIFTY: 50,
  BANKNIFTY: 100
}

/**
 * Calculate option price using simplified Black-Scholes
 * Formula: Intrinsic Value + Time Value
 */
export function calculateOptionPrice(
  contract: FnoContract,
  spotPrice: number
): number {
  const { strike, optionType, index } = contract
  const timeValue = TIME_VALUES[index]
  
  let intrinsicValue = 0
  
  if (optionType === 'CE') {
    // Call option: max(spot - strike, 0)
    intrinsicValue = Math.max(spotPrice - strike, 0)
  } else {
    // Put option: max(strike - spot, 0)
    intrinsicValue = Math.max(strike - spotPrice, 0)
  }
  
  // Total premium = intrinsic + time value
  const premium = intrinsicValue + timeValue
  
  // Minimum premium of 0.5 to avoid zero prices
  return Math.max(premium, 0.5)
}

/**
 * Generate strike prices around current spot price
 * NIFTY: Round to nearest 50, BANKNIFTY: Round to nearest 100
 */
export function generateStrikes(index: FnoIndex, spotPrice: number): StrikeRange {
  const interval = STRIKE_INTERVALS[index]
  
  // Round spot to nearest strike interval
  const atm = Math.round(spotPrice / interval) * interval
  
  // Generate 10 strikes above and below ATM
  const strikes: number[] = []
  for (let i = -10; i <= 10; i++) {
    strikes.push(atm + (i * interval))
  }
  
  return { strikes, atm }
}

/**
 * Calculate next Thursday expiry (NSE F&O expiry day)
 * Auto-calculated, not stored in database
 */
export function getNextExpiry(): Date {
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 4 = Thursday
  
  let daysToAdd: number
  
  if (currentDay < 4) {
    // Before Thursday this week
    daysToAdd = 4 - currentDay
  } else if (currentDay === 4) {
    // Today is Thursday - check if market is closed (after 3:30 PM IST)
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    const hour = istTime.getHours()
    const minute = istTime.getMinutes()
    
    if (hour > 15 || (hour === 15 && minute >= 30)) {
      // After 3:30 PM IST, move to next Thursday
      daysToAdd = 7
    } else {
      // Before 3:30 PM IST, same day expiry
      daysToAdd = 0
    }
  } else {
    // After Thursday, next Thursday
    daysToAdd = 7 - currentDay + 4
  }
  
  const expiry = new Date(now)
  expiry.setDate(now.getDate() + daysToAdd)
  expiry.setHours(15, 30, 0, 0) // 3:30 PM IST
  
  return expiry
}

/**
 * Check if positions are expired (after 3:30 PM IST on expiry day)
 */
export function isExpired(expiry: Date): boolean {
  const now = new Date()
  return now > expiry
}

/**
 * Calculate settlement price for expired options
 * Uses intrinsic value only (no time value)
 */
export function getSettlementPrice(
  contract: FnoContract,
  spotPrice: number
): number {
  const { strike, optionType } = contract
  
  if (optionType === 'CE') {
    return Math.max(spotPrice - strike, 0)
  } else {
    return Math.max(strike - spotPrice, 0)
  }
}