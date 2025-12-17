// NSE F&O market hours: 9:15 AM to 3:30 PM IST (Monday to Friday)
export function isMarketOpen(): boolean {
  const now = new Date()
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)) // Convert to IST
  
  const day = istTime.getDay() // 0 = Sunday, 6 = Saturday
  if (day === 0 || day === 6) return false // Weekend
  
  const hours = istTime.getHours()
  const minutes = istTime.getMinutes()
  const timeInMinutes = hours * 60 + minutes
  
  const marketStart = 9 * 60 + 15 // 9:15 AM
  const marketEnd = 15 * 60 + 30 // 3:30 PM
  
  return timeInMinutes >= marketStart && timeInMinutes <= marketEnd
}