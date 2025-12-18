/**
 * Shared P&L calculation utilities for trading operations
 * Ensures consistency across manual and automated square-offs
 */

export interface PositionPnL {
  pnl: number
  balanceChange: number
  isProfit: boolean
}

/**
 * Calculate P&L for closing a position
 * @param isShort - Whether the position is a short position
 * @param avgPrice - Average entry price of the position
 * @param currentPrice - Current market price
 * @param quantity - Absolute quantity (always positive)
 * @returns P&L details and balance change
 */
export function calculateClosingPnL(
  isShort: boolean,
  avgPrice: number,
  currentPrice: number,
  quantity: number
): PositionPnL {
  if (isShort) {
    // Short position P&L: Profit when price drops, loss when price rises
    // Entry: Sold at avgPrice (received cash)
    // Exit: Buy at currentPrice (pay cash)
    // P&L = (avgPrice - currentPrice) * quantity
    const pnl = (avgPrice - currentPrice) * quantity
    return {
      pnl,
      balanceChange: pnl,
      isProfit: pnl > 0,
    }
  } else {
    // Long position P&L: Profit when price rises, loss when price drops
    // Entry: Bought at avgPrice (paid cash)
    // Exit: Sell at currentPrice (receive cash)
    // Balance change = currentPrice * quantity (proceeds from sale)
    const totalProceeds = currentPrice * quantity
    const pnl = (currentPrice - avgPrice) * quantity
    return {
      pnl,
      balanceChange: totalProceeds,
      isProfit: pnl > 0,
    }
  }
}

/**
 * Calculate balance change when covering a short position
 * @param avgPrice - Average short entry price
 * @param currentPrice - Current market price to cover at
 * @param quantity - Absolute quantity (always positive)
 * @returns Total cost to cover the short position
 */
export function calculateShortCoveringCost(
  avgPrice: number,
  currentPrice: number,
  quantity: number
): number {
  // When covering short: Pay full market value
  return currentPrice * quantity
}

/**
 * Calculate balance change when opening a short position
 * @param price - Short entry price
 * @param quantity - Quantity to short
 * @returns Proceeds credited to balance
 */
export function calculateShortOpeningProceeds(price: number, quantity: number): number {
  // When opening short: Receive full market value
  return price * quantity
}
