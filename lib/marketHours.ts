export function isMarketOpen(): { open: boolean; message?: string } {
  const now = new Date()
  
  // Get IST day of week using Intl.DateTimeFormat
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short'
  })
  
  const dayName = dayFormatter.format(now)
  const isWeekend = dayName === 'Sat' || dayName === 'Sun'
  
  if (isWeekend) {
    return { open: false, message: 'Market is closed on weekends' }
  }
  
  // Get IST time using Intl.DateTimeFormat
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  const parts = timeFormatter.formatToParts(now)
  const hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
  const minutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
  
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
