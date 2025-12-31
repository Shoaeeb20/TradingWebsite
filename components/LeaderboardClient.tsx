'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface LeaderboardUser {
  rank: number
  name: string
  email?: string
  returnPercent: number
  currentValue: number
  balance: number
  fnoBalance: number
  holdingsValue: number
  fnoUnrealizedPnL: number
  totalInvested: number
  netPnL: number
  isCurrentUser?: boolean
}

interface LeaderboardData {
  users: LeaderboardUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function LeaderboardClient() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [timeframe])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leaderboard?timeframe=${timeframe}&limit=50`)
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      
      const data = await response.json()
      
      // Mark current user if logged in
      if (session?.user?.email && data.users) {
        data.users = data.users.map((user: LeaderboardUser) => ({
          ...user,
          isCurrentUser: user.email === session.user.email
        }))
      }
      
      setLeaderboard(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
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
    if (returnPercent > 20) return 'text-green-600'
    if (returnPercent > 10) return 'text-green-500'
    if (returnPercent > 0) return 'text-green-400'
    if (returnPercent > -10) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !leaderboard) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load leaderboard</p>
          <button 
            onClick={fetchLeaderboard}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Performers</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['all', 'monthly', 'weekly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Current User Position (if logged in and not in top 10) */}
        {session && leaderboard.users && (
          (() => {
            const currentUser = leaderboard.users.find(u => u.isCurrentUser)
            return currentUser && currentUser.rank > 10 ? (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Your Position</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-600">
                      #{currentUser.rank}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">{currentUser.name}</div>
                      <div className="text-sm text-gray-600">
                        ₹{currentUser.currentValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getPerformanceColor(currentUser.returnPercent)}`}>
                    {currentUser.returnPercent >= 0 ? '+' : ''}
                    {currentUser.returnPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ) : null
          })()
        )}

        {/* Top 10 Leaderboard */}
        <div className="space-y-2">
          {leaderboard.users.slice(0, 10).map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                user.isCurrentUser
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold min-w-[3rem] text-center">
                  {getRankIcon(user.rank)}
                </div>
                <div>
                  <div className={`font-semibold ${user.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                    {user.name}
                    {user.isCurrentUser && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Portfolio: ₹{user.currentValue.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getPerformanceColor(user.returnPercent)}`}>
                  {user.returnPercent >= 0 ? '+' : ''}
                  {user.returnPercent.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500">ROI</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{leaderboard.pagination?.total || 0}</div>
              <div className="text-sm text-gray-600">Total Traders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {leaderboard.users[0]?.returnPercent?.toFixed(2) || '0.00'}%
              </div>
              <div className="text-sm text-gray-600">Top ROI</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                ₹{leaderboard.users[0]?.currentValue?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Top Portfolio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!session && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Join the Competition!</h3>
          <p className="mb-4 opacity-90">
            Sign up now and start your journey to the top of the leaderboard
          </p>
          <a 
            href="/auth/signin"
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started
          </a>
        </div>
      )}
    </div>
  )
}