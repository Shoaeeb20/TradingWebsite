'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface PeerData {
  userRank: number
  userROI: number
  userTrades: number
  totalUsers: number
  percentile: number
  similarTraders: {
    avgROI: number
    avgTrades: number
    count: number
  }
  topPerformers: {
    name: string
    roi: number
    trades: number
  }[]
  insights: string[]
}

export default function PeerComparison() {
  const { data: session } = useSession()
  const [peerData, setPeerData] = useState<PeerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetchPeerComparison()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchPeerComparison = async () => {
    try {
      const response = await fetch('/api/social/peer-comparison')
      if (!response.ok) throw new Error('Failed to fetch peer comparison')
      
      const data = await response.json()
      setPeerData(data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Peer Comparison</h3>
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">🔒</span>
          <p className="text-gray-600 mb-4">Sign in to compare your performance with peers</p>
          <a 
            href="/auth/signin"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Peer Comparison</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !peerData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Peer Comparison</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load peer comparison</p>
          <button 
            onClick={fetchPeerComparison}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const getPerformanceColor = (roi: number) => {
    if (roi > 10) return 'text-green-600'
    if (roi > 0) return 'text-green-500'
    if (roi > -10) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (percentile: number) => {
    if (percentile >= 90) return { text: 'Top 10%', color: 'bg-green-100 text-green-800', icon: '🏆' }
    if (percentile >= 75) return { text: 'Top 25%', color: 'bg-blue-100 text-blue-800', icon: '⭐' }
    if (percentile >= 50) return { text: 'Above Average', color: 'bg-yellow-100 text-yellow-800', icon: '📈' }
    if (percentile >= 25) return { text: 'Below Average', color: 'bg-orange-100 text-orange-800', icon: '📊' }
    return { text: 'Bottom 25%', color: 'bg-red-100 text-red-800', icon: '📉' }
  }

  const badge = getPerformanceBadge(peerData.percentile)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Peer Comparison</h3>

      {/* Your Performance */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Your Performance</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
            {badge.icon} {badge.text}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Rank</div>
            <div className="text-xl font-bold text-gray-900">
              #{peerData.userRank}
            </div>
            <div className="text-xs text-gray-500">
              of {peerData.totalUsers}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">ROI</div>
            <div className={`text-xl font-bold ${getPerformanceColor(peerData.userROI)}`}>
              {peerData.userROI >= 0 ? '+' : ''}{peerData.userROI.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Trades</div>
            <div className="text-xl font-bold text-gray-900">
              {peerData.userTrades}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Traders */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Similar Traders</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Avg ROI</div>
              <div className={`text-lg font-semibold ${getPerformanceColor(peerData.similarTraders.avgROI)}`}>
                {peerData.similarTraders.avgROI >= 0 ? '+' : ''}{peerData.similarTraders.avgROI.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Trades</div>
              <div className="text-lg font-semibold text-gray-900">
                {peerData.similarTraders.avgTrades.toFixed(0)}
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-gray-500">
              Based on {peerData.similarTraders.count} traders with similar activity
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">🏆 Top Performers</h4>
        <div className="space-y-2">
          {peerData.topPerformers.map((performer, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <span className="text-sm font-medium">{performer.name}</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${getPerformanceColor(performer.roi)}`}>
                  {performer.roi >= 0 ? '+' : ''}{performer.roi.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500">
                  {performer.trades} trades
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">💡 Insights</h4>
        <div className="space-y-2">
          {peerData.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="text-gray-700">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={() => window.location.href = '/market'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Start Trading to Improve Rank
        </button>
      </div>
    </div>
  )
}