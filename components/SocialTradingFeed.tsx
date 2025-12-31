'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface FeedItem {
  id: string
  type: 'trade' | 'achievement' | 'milestone' | 'join'
  user: {
    name: string
    email?: string
  }
  content: {
    symbol?: string
    amount?: number
    profit?: number
    achievement?: string
    milestone?: string
  }
  timestamp: string
  isAnonymous?: boolean
}

export default function SocialTradingFeed() {
  const { data: session } = useSession()
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeed()
    
    // Refresh feed every 30 seconds
    const interval = setInterval(fetchFeed, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchFeed = async () => {
    try {
      const response = await fetch('/api/social/feed')
      if (!response.ok) throw new Error('Failed to fetch feed')
      
      const data = await response.json()
      setFeed(data.feed || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trade': return '📈'
      case 'achievement': return '🏆'
      case 'milestone': return '🎯'
      case 'join': return '👋'
      default: return '📊'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'trade': return 'bg-blue-50 border-blue-200'
      case 'achievement': return 'bg-yellow-50 border-yellow-200'
      case 'milestone': return 'bg-green-50 border-green-200'
      case 'join': return 'bg-purple-50 border-purple-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const renderFeedItem = (item: FeedItem) => {
    const userName = item.isAnonymous ? 'Anonymous Trader' : item.user.name

    switch (item.type) {
      case 'trade':
        return (
          <div key={item.id} className={`p-4 rounded-lg border ${getActivityColor(item.type)}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getActivityIcon(item.type)}</span>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{userName}</span> traded{' '}
                  <span className="font-semibold text-blue-600">{item.content.symbol}</span>
                  {item.content.amount && (
                    <span> worth ₹{item.content.amount.toLocaleString()}</span>
                  )}
                  {item.content.profit !== undefined && (
                    <span className={item.content.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {' '}({item.content.profit >= 0 ? '+' : ''}₹{item.content.profit.toLocaleString()})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(item.timestamp)}</p>
              </div>
            </div>
          </div>
        )

      case 'achievement':
        return (
          <div key={item.id} className={`p-4 rounded-lg border ${getActivityColor(item.type)}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getActivityIcon(item.type)}</span>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{userName}</span> unlocked{' '}
                  <span className="font-semibold text-yellow-600">{item.content.achievement}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(item.timestamp)}</p>
              </div>
            </div>
          </div>
        )

      case 'milestone':
        return (
          <div key={item.id} className={`p-4 rounded-lg border ${getActivityColor(item.type)}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getActivityIcon(item.type)}</span>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{userName}</span> reached{' '}
                  <span className="font-semibold text-green-600">{item.content.milestone}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(item.timestamp)}</p>
              </div>
            </div>
          </div>
        )

      case 'join':
        return (
          <div key={item.id} className={`p-4 rounded-lg border ${getActivityColor(item.type)}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getActivityIcon(item.type)}</span>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{userName}</span> joined the community
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(item.timestamp)}</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Community Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Community Activity</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load community activity</p>
          <button 
            onClick={fetchFeed}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            Try again
          </button>
        </div>
      ) : feed.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">🌟</span>
          <p>Be the first to make some trades!</p>
          <p className="text-sm mt-1">Your activity will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {feed.map(renderFeedItem)}
        </div>
      )}

      {!session && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-700">
            <a href="/auth/signin" className="font-medium hover:underline">
              Sign in
            </a>{' '}
            to see your activity in the feed
          </p>
        </div>
      )}
    </div>
  )
}