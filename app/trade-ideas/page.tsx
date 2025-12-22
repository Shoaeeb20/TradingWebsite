'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface TradeIdea {
  _id: string
  title: string
  symbol: string
  type: 'EQUITY' | 'FNO'
  action: 'BUY' | 'SELL'
  entryPrice?: number
  targetPrice?: number
  stopLoss?: number
  quantity?: number
  rationale: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  timeHorizon: 'INTRADAY' | 'SHORT_TERM' | 'MEDIUM_TERM'
  createdAt: string
  expiresAt: string
}

interface SubscriptionStatus {
  isActive: boolean
  status: string
  expiresAt?: string
  daysRemaining?: number
}

export default function TradeIdeasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tradeIdeas, setTradeIdeas] = useState<TradeIdea[]>([])
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    type: '',
    action: '',
    riskLevel: '',
    timeHorizon: ''
  })
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/trade-ideas')
    }
  }, [status, router])

  // Fetch trade ideas and subscription status
  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/trade-ideas?${params}`)
      const data = await response.json()

      if (data.success) {
        setTradeIdeas(data.data.tradeIdeas)
        setSubscriptionStatus(data.data.subscriptionStatus)
        setLastUpdated(data.data.lastUpdated)
        setError(null)
      } else {
        if (response.status === 403) {
          // User doesn't have active subscription
          setSubscriptionStatus(data.subscriptionStatus)
          setTradeIdeas([])
        } else {
          setError(data.error || 'Failed to fetch trade ideas')
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, filters])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (session && subscriptionStatus?.isActive) {
      const interval = setInterval(fetchData, 5 * 60 * 1000) // 5 minutes
      return () => clearInterval(interval)
    }
  }, [session, subscriptionStatus])

  // Show subscription page if not active
  if (subscriptionStatus && !subscriptionStatus.isActive) {
    router.push('/trade-ideas/subscribe')
    return null
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trade ideas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionColor = (action: string) => {
    return action === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Legal Disclaimer - Top of Page */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">⚠️ Legal Disclaimer</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  <strong>This platform is not SEBI registered.</strong> All trade ideas are strictly for paper trading and educational purposes only. 
                  No real-money trading or investment advice is provided.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paper Trade Ideas</h1>
              <p className="text-gray-600 mt-1">
                Professional trading suggestions for paper trading practice
              </p>
            </div>
            <div className="text-right">
              {subscriptionStatus && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active until {subscriptionStatus.expiresAt ? 
                    new Date(subscriptionStatus.expiresAt).toLocaleDateString('en-IN') : 'N/A'}
                </div>
              )}
              <div className="text-sm text-gray-500 mt-1">
                Auto-updates every 5 minutes
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Updating...' : 'Refresh Now'}
            </button>
            
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Last updated: {formatDate(lastUpdated)}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Ideas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="EQUITY">Equity</option>
              <option value="FNO">F&O</option>
            </select>

            <select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Actions</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>

            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>

            <select
              value={filters.timeHorizon}
              onChange={(e) => setFilters(prev => ({ ...prev, timeHorizon: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Time Horizons</option>
              <option value="INTRADAY">Intraday</option>
              <option value="SHORT_TERM">Short Term</option>
              <option value="MEDIUM_TERM">Medium Term</option>
            </select>
          </div>
        </div>

        {/* Trade Ideas Grid */}
        {tradeIdeas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trade Ideas Available</h3>
            <p className="text-gray-600">Check back later for new trading suggestions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradeIdeas.map((idea) => (
              <div key={idea._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                    {idea.symbol !== 'GENERAL' && (
                      <p className="text-xl font-bold text-blue-600">{idea.symbol}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${idea.type === 'EQUITY' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {idea.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(idea.action)}`}>
                      {idea.action}
                    </span>
                  </div>
                </div>

                {/* Price Levels */}
                {(idea.entryPrice || idea.targetPrice || idea.stopLoss) && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {idea.entryPrice && (
                        <div>
                          <span className="text-gray-600 block">Entry</span>
                          <span className="font-semibold">₹{idea.entryPrice}</span>
                        </div>
                      )}
                      {idea.targetPrice && (
                        <div>
                          <span className="text-gray-600 block">Target</span>
                          <span className="font-semibold text-green-600">₹{idea.targetPrice}</span>
                        </div>
                      )}
                      {idea.stopLoss && (
                        <div>
                          <span className="text-gray-600 block">Stop Loss</span>
                          <span className="font-semibold text-red-600">₹{idea.stopLoss}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Trade Message */}
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
{idea.rationale}
                    </pre>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(idea.riskLevel)}`}>
                    {idea.riskLevel} Risk
                  </span>
                  <span className="text-xs text-gray-500">
                    {idea.timeHorizon.replace('_', ' ')}
                  </span>
                </div>

                {/* Action Button */}
                {idea.symbol !== 'GENERAL' && (
                  <button
                    onClick={() => router.push(`/trade?symbol=${idea.symbol}&type=${idea.type.toLowerCase()}`)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Paper Trade This
                  </button>
                )}

                {/* Timestamp */}
                <div className="mt-3 text-xs text-gray-500 text-center">
                  Posted: {formatDate(idea.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Legal Disclaimer</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  <strong>This platform is not SEBI registered.</strong> All trade ideas are strictly for paper trading and educational purposes only. 
                  No real-money trading or investment advice is provided. Please consult with a qualified financial advisor before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}