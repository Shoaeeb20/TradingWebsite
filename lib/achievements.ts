export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  reward?: string
  condition: (userStats: UserStats) => boolean
}

export interface UserStats {
  totalTrades: number
  totalProfit: number
  daysSinceJoined: number
  hasFirstTrade: boolean
  consecutiveTradingDays?: number
  biggestWin?: number
  biggestLoss?: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_trade',
    title: 'First Steps!',
    description: 'Completed your very first trade',
    icon: '🎯',
    reward: '₹10,000 bonus',
    condition: (stats) => stats.hasFirstTrade
  },
  {
    id: 'trader_5',
    title: 'Getting Started',
    description: 'Completed 5 trades',
    icon: '📈',
    reward: '₹5,000 bonus',
    condition: (stats) => stats.totalTrades >= 5
  },
  {
    id: 'trader_10',
    title: 'Active Trader',
    description: 'Completed 10 trades',
    icon: '🚀',
    reward: '₹10,000 bonus',
    condition: (stats) => stats.totalTrades >= 10
  },
  {
    id: 'trader_25',
    title: 'Trading Enthusiast',
    description: 'Completed 25 trades',
    icon: '⭐',
    reward: '₹15,000 bonus',
    condition: (stats) => stats.totalTrades >= 25
  },
  {
    id: 'trader_50',
    title: 'Trading Expert',
    description: 'Completed 50 trades',
    icon: '🏆',
    reward: '₹25,000 bonus',
    condition: (stats) => stats.totalTrades >= 50
  },
  {
    id: 'profitable_trader',
    title: 'Profit Maker',
    description: 'Made your first profit',
    icon: '💰',
    reward: '₹5,000 bonus',
    condition: (stats) => stats.totalProfit > 0
  },
  {
    id: 'big_profit',
    title: 'Big Winner',
    description: 'Made ₹10,000+ profit',
    icon: '💎',
    reward: '₹20,000 bonus',
    condition: (stats) => stats.totalProfit >= 10000
  },
  {
    id: 'week_trader',
    title: 'One Week Strong',
    description: 'Trading for a full week',
    icon: '📅',
    reward: '₹7,000 bonus',
    condition: (stats) => stats.daysSinceJoined >= 7
  },
  {
    id: 'month_trader',
    title: 'Monthly Trader',
    description: 'Trading for a full month',
    icon: '🗓️',
    reward: '₹30,000 bonus',
    condition: (stats) => stats.daysSinceJoined >= 30
  }
]

/**
 * Check which achievements a user has unlocked
 */
export function checkAchievements(userStats: UserStats, previousStats?: UserStats): Achievement[] {
  const newAchievements: Achievement[] = []
  
  for (const achievement of ACHIEVEMENTS) {
    const currentlyUnlocked = achievement.condition(userStats)
    const previouslyUnlocked = previousStats ? achievement.condition(previousStats) : false
    
    // Only return newly unlocked achievements
    if (currentlyUnlocked && !previouslyUnlocked) {
      newAchievements.push(achievement)
    }
  }
  
  return newAchievements
}

/**
 * Get all unlocked achievements for a user
 */
export function getUnlockedAchievements(userStats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.condition(userStats))
}

/**
 * Get next achievement to unlock
 */
export function getNextAchievement(userStats: UserStats): Achievement | null {
  const unlockedAchievements = getUnlockedAchievements(userStats)
  const lockedAchievements = ACHIEVEMENTS.filter(
    achievement => !unlockedAchievements.includes(achievement)
  )
  
  // Return the first locked achievement (they're ordered by difficulty)
  return lockedAchievements[0] || null
}