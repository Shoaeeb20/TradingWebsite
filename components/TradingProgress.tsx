'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getNextAchievement, getUnlockedAchievements, Achievement } from '@/lib/achievements'

interface TradingProgressProps {
  userProgress?: {
    hasFirstTrade: boolean
    totalTrades: number
    totalProfit: number
    daysSinceJoined: number
  }
}

export default function TradingProgress({ userProgress }: TradingProgressProps) {
  const { data: session } = useSession()
  const [nextAchievement, setNextAchievement] = useState<Achievement | null>(null)
  const [unlockedCount, setUnlockedCount] = useState(0)

  useEffect(() => {
    if (userProgress) {
      const userStats = {
        totalTrades: userProgress.totalTrades,
        totalProfit: userProgress.totalProfit,
        daysSinceJoined: userProgress.daysSinceJoined,
        hasFirstTrade: userProgress.hasFirstTrade
      }

      const next = getNextAchievement(userStats)
      const unlocked = getUnlockedAchievements(userStats)
      
      setNextAchievement(next)
      setUnlockedCount(unlocked.length)
    }
  }, [userProgress])

  if (!session || !userProgress || !nextAchievement) {
    return null
  }

  // Calculate progress towards next achievement
  const getProgress = () => {
    if (nextAchievement.id === 'trader_5') {
      return Math.min((userProgress.totalTrades / 5) * 100, 100)
    }
    if (nextAchievement.id === 'trader_10') {
      return Math.min((userProgress.totalTrades / 10) * 100, 100)
    }
    if (nextAchievement.id === 'trader_25') {
      return Math.min((userProgress.totalTrades / 25) * 100, 100)
    }
    if (nextAchievement.id === 'trader_50') {
      return Math.min((userProgress.totalTrades / 50) * 100, 100)
    }
    if (nextAchievement.id === 'profitable_trader') {
      return userProgress.totalProfit > 0 ? 100 : 0
    }
    if (nextAchievement.id === 'big_profit') {
      return Math.min((userProgress.totalProfit / 10000) * 100, 100)
    }
    if (nextAchievement.id === 'week_trader') {
      return Math.min((userProgress.daysSinceJoined / 7) * 100, 100)
    }
    if (nextAchievement.id === 'month_trader') {
      return Math.min((userProgress.daysSinceJoined / 30) * 100, 100)
    }
    return 0
  }

  const progress = getProgress()

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <h3 className="font-semibold text-indigo-900">Trading Progress</h3>
        </div>
        <div className="text-sm text-indigo-600">
          {unlockedCount}/9 achievements
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            Next: {nextAchievement.icon} {nextAchievement.title}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-600 mt-1">
          {nextAchievement.description}
          {nextAchievement.reward && (
            <span className="text-indigo-600 font-medium"> • Reward: {nextAchievement.reward}</span>
          )}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-indigo-900">{userProgress.totalTrades}</div>
          <div className="text-xs text-gray-600">Trades</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${userProgress.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{userProgress.totalProfit.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">P&L</div>
        </div>
        <div>
          <div className="text-lg font-bold text-indigo-900">{userProgress.daysSinceJoined}</div>
          <div className="text-xs text-gray-600">Days</div>
        </div>
      </div>
    </div>
  )
}