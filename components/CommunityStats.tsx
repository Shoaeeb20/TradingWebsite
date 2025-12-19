'use client'

import { useState, useEffect } from 'react'

interface CommunityStatsData {
  totalTraders: number
  activeTraders: number
  inactiveTraders: number
  newTraders: number
  totalTrades: number
  tradesLast24h: number
  topTrader: {
    name: string
    roi: number
  } | null
  lastUpdated: string
}

export default function CommunityStats() {
  const [stats, setStats] = useState<CommunityStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Add timestamp to prevent caching
      const response = await fetch(`/api/community-stats?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch community stats')
      }
      const data = await response.json()
      setStats(data)
      setError(null)
      setLastFetchTime(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Refresh stats every 30 seconds for more real-time feel
    const interval = setInterval(fetchStats, 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading community statistics...</p>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <p className="text-gray-600">Unable to load community statistics</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString('en-IN')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeSinceLastFetch = () => {
    if (!lastFetchTime) return ''
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - lastFetchTime.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h ago`
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Community Statistics</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Updates every 30 seconds</span>
            {loading && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-600 font-medium">Updating...</span>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Traders */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Traders</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalTraders)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Registered users</span>
          </div>
        </div>

        {/* Active Traders */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Traders</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.activeTraders)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Traded in last 30 days</span>
          </div>
        </div>

        {/* New Traders */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">New This Week</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.newTraders)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Joined in last 7 days</span>
          </div>
        </div>

        {/* Inactive Traders */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Inactive</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.inactiveTraders)}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <span className="text-2xl">😴</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">No trades in 30 days</span>
          </div>
        </div>
      </div>

      {/* Trading Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Trades */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trading Activity</h3>
            <div className="p-2 bg-orange-100 rounded-full">
              <span className="text-xl">📊</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Trades</span>
              <span className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalTrades)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last 24 Hours</span>
              <span className="text-xl font-semibold text-green-600">{formatNumber(stats.tradesLast24h)}</span>
            </div>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performer</h3>
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-xl">🏆</span>
            </div>
          </div>
          {stats.topTrader ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trader</span>
                <span className="font-semibold text-gray-900">{stats.topTrader.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROI</span>
                <span className={`text-xl font-bold ${
                  stats.topTrader.roi >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.topTrader.roi >= 0 ? '+' : ''}{stats.topTrader.roi.toFixed(2)}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>

      {/* Activity Percentage */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Activity</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Active Traders</span>
              <span className="font-medium">{((stats.activeTraders / stats.totalTraders) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.activeTraders / stats.totalTraders) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">New Traders (This Week)</span>
              <span className="font-medium">{((stats.newTraders / stats.totalTraders) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.newTraders / stats.totalTraders) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated with Live Indicator */}
      <div className="flex justify-center items-center gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-green-600">LIVE</span>
        </div>
        <span>•</span>
        <span>Data: {formatDate(stats.lastUpdated)}</span>
        {lastFetchTime && (
          <>
            <span>•</span>
            <span>Fetched: {getTimeSinceLastFetch()}</span>
          </>
        )}
      </div>
    </div>
  )
}