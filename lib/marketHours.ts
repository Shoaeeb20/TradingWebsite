export function isMarketOpen(): { open: boolean; message?: string } {
  const now = new Date()
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  
  const day = istTime.getDay()
  if (day === 0 || day === 6) {
    return { open: false, message: 'Market is closed on weekends' }
  }
  
  const hours = istTime.getHours()
  const minutes = istTime.getMinutes()
  const timeInMinutes = hours * 60 + minutes
  
  const marketOpen = 9 * 60 + 15  // 9:15 AM
  const marketClose = 15 * 60 + 30 // 3:30 PM
  
  if (timeInMinutes < marketOpen) {
    return { open: false, message: 'Market opens at 9:15 AM IST' }
  }
  
  if (timeInMinutes > marketClose) {
    return { open: false, message: 'Market closed at 3:30 PM IST' }
  }
  
  return { open: true }
}
