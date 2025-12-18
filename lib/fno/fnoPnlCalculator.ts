/**
 * F&O P&L calculation utilities
 * Options trading is different from stocks - you don't get back original investment
 * Only P&L is credited/debited on position closure
 */

export interface FnoPnL {
  pnl: number
  balanceChange: number
  isProfit: boolean
}

/**
 * Calculate P&L when closing an F&O position
 * @param avgPrice - Average entry price of the position
 * @param currentPrice - Current market price
 * @param quantity - Position quantity (positive for long, negative for short)
 * @returns P&L details
 */
export function calculateFnoClosingPnL(
  avgPrice: number,
  currentPrice: number,
  quantity: number
): FnoPnL {
  // P&L = (current price - avg price) * quantity
  // Positive quantity (long): profit when price rises
  // Negative quantity (short): profit when price falls
  const pnl = (currentPrice - avgPrice) * quantity
  
  return {
    pnl,
    balanceChange: pnl, // Only P&L affects balance in options
    isProfit: pnl > 0,
  }
}

/**
 * Calculate weighted average price when adding to existing position
 * @param existingAvgPrice - Current average price
 * @param existingQuantity - Current position quantity (signed)
 * @param newPrice - New trade price
 * @param newQuantity - New trade quantity (signed)
 * @returns New average price
 */
export function calculateFnoAveragePrice(
  existingAvgPrice: number,
  existingQuantity: number,
  newPrice: number,
  newQuantity: number
): number {
  const existingValue = existingAvgPrice * Math.abs(existingQuantity)
  const newValue = newPrice * Math.abs(newQuantity)
  const totalQuantity = Math.abs(existingQuantity + newQuantity)
  
  if (totalQuantity === 0) return 0
  
  return (existingValue + newValue) / totalQuantity
}

/**
 * Calculate margin requirement for F&O positions
 * @param price - Option price
 * @param quantity - Trade quantity
 * @param isShort - Whether it's a short position
 * @returns Required margin amount
 */
export function calculateFnoMargin(
  price: number,
  quantity: number,
  isShort: boolean
): number {
  if (!isShort) {
    // Long positions: pay full premium
    return price * quantity
  } else {
    // Short positions: margin requirement (20% of premium + minimum)
    const premiumValue = price * quantity
    const marginPercent = 0.2 // 20% margin
    const minimumMargin = 1000 // Minimum ₹1000 margin per lot
    
    return Math.max(premiumValue * marginPercent, minimumMargin)
  }
}

/**
 * Validate if user has sufficient balance for F&O trade
 * @param userBalance - User's F&O balance
 * @param price - Option price
 * @param quantity - Trade quantity
 * @param isShort - Whether it's a short position
 * @returns Validation result
 */
export function validateFnoBalance(
  userBalance: number,
  price: number,
  quantity: number,
  isShort: boolean
): { valid: boolean; required: number; error?: string } {
  const required = calculateFnoMargin(price, quantity, isShort)
  
  if (userBalance < required) {
    const action = isShort ? 'short selling' : 'buying'
    return {
      valid: false,
      required,
      error: `Insufficient F&O balance for ${action}. Required: ₹${required.toFixed(2)}, Available: ₹${userBalance.toFixed(2)}`
    }
  }
  
  return { valid: true, required }
}