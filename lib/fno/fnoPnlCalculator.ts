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
 * @param isClosing - Whether this is a position closing (affects margin release)
 * @returns P&L details
 */
export function calculateFnoClosingPnL(
  avgPrice: number,
  currentPrice: number,
  quantity: number,
  isClosing: boolean = true
): FnoPnL {
  const isShort = quantity < 0
  const absQuantity = Math.abs(quantity)
  
  if (isClosing) {
    if (isShort) {
      // Short position closing: Get back margin + P&L
      // P&L = (entry price - current price) * abs(quantity) [profit when price falls]
      const pnl = (avgPrice - currentPrice) * absQuantity
      
      // Release the margin that was blocked + P&L
      const marginBlocked = calculateFnoMargin(avgPrice, absQuantity, true)
      
      return {
        pnl,
        balanceChange: marginBlocked + pnl, // Margin release + P&L
        isProfit: pnl > 0,
      }
    } else {
      // Long position closing: Get current value (original investment + P&L)
      // This is like selling the option at current market price
      const currentValue = currentPrice * absQuantity
      const pnl = (currentPrice - avgPrice) * absQuantity
      
      return {
        pnl,
        balanceChange: currentValue, // Get back current market value
        isProfit: pnl > 0,
      }
    }
  } else {
    // Non-closing calculation (just for display)
    const pnl = isShort 
      ? (avgPrice - currentPrice) * absQuantity
      : (currentPrice - avgPrice) * absQuantity
    
    return {
      pnl,
      balanceChange: pnl, // Just P&L for display
      isProfit: pnl > 0,
    }
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
    // Short positions: margin requirement for option selling
    // Use a more realistic margin calculation
    const premiumValue = price * quantity
    
    // For option selling, margin is typically higher
    // Base margin: 10% of strike price + premium value
    // Simplified: Use 3x premium value or minimum ₹5000 per lot
    const baseMargin = premiumValue * 3
    const minimumMargin = 5000 * quantity // ₹5000 per lot minimum
    
    return Math.max(baseMargin, minimumMargin)
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