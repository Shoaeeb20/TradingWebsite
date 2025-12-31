'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TopTrader {
  name: string
  returnPercent: number
  rank: number
}

export default function SocialLeaderboardWidget() {
  const [topTraders, setTopTraders] = useState<TopTrader[]>([])
  const [loading, setLoading] = useState(true)
  const [showWidget, setShowWidget] = useState(false)

  useEffect(() => {
    fetchTopTraders()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchTopTraders, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchTopTraders = async () => {
    try {
      const response = await fetch('/api/leaderboard?limit=3')
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      
      const data = await response.json()
      if (data.users && data.users.length > 0) {
        setTopTraders(data.users.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch top traders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getPerformanceColor = (returnPercent: number) => {
    if (returnPercent > 10) return 'text-green-600'
    if (returnPercent > 0) return 'text-green-500'
    return 'text-red-500'
  }

  if (loading || topTraders.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setShowWidget(!showWidget)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 text-sm font-medium shadow-lg"
        title="Top Performers"
      >
        <span className="text-lg">🏆</span>
        <span className="hidden sm:inline">Top 3</span>
      </button>

      {/* Widget Dropdown */}
      {showWidget && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowWidget(false)}
          />
          
          {/* Widget Content */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border p-4 z-20 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">🏆 Top Performers</h3>
              <Link 
                href="/leaderboard"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={() => setShowWidget(false)}
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {topTraders.map((trader) => (
                <div
                  key={trader.rank}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold min-w-[2rem]">
                      {getRankIcon(trader.rank)}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {trader.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Rank #{trader.rank}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${getPerformanceColor(trader.returnPercent)}`}>
                      {trader.returnPercent >= 0 ? '+' : ''}
                      {trader.returnPercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">ROI</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t">
              <Link
                href="/leaderboard"
                onClick={() => setShowWidget(false)}
                className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 text-center text-sm"
              >
                Join the Competition
              </Link>
            </div>

            <div className="mt-2 text-xs text-gray-500 text-center">
              Updated every 5 minutes
            </div>
          </div>
        </>
      )}
    </div>
  )
}