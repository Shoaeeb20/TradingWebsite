'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AlgoStrategy {
  _id: string
  isActive: boolean
  symbols: string[]
  parameters: {
    shortMA: number
    longMA: number
    quantity: number
  }
  lastRun?: string
  lastSignal?: {
    symbol: string
    signal: 'BUY' | 'SELL' | 'HOLD'
    timestamp: string
    shortMA: number
    longMA: number
    price: number
  }
  performance: {
    totalTrades: number
    winningTrades: number
    totalPnL: number
    currentPositions: number
  }
}

interface SubscriptionInfo {
  isActive: boolean
  status: string
  expiresAt?: string
  daysRemaining?: number
}

export default function AlgoTradingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [strategy, setStrategy] = useState<AlgoStrategy | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/algo-trading')
    }
  }, [status, router])

  // Fetch strategy data
  useEffect(() => {
    if (session) {
      fetchStrategy()
    }
  }, [session])

  const fetchStrategy = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/algo/strategy')
      const data = await response.json()
      
      if (data.success) {
        setStrategy(data.data.strategy)
        setSubscription(data.data.subscription)
      } else {
        setError('Failed to load strategy')
      }
    } catch (err) {
      setError('Network error while loading strategy')
    } finally {
      setLoading(false)
    }
  }

  const toggleStrategy = async () => {
    if (!strategy) return

    try {
      setUpdating(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/algo/strategy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !strategy.isActive,
          symbols: strategy.symbols,
          parameters: strategy.parameters
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setStrategy(data.data)
        setSuccess(data.message)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to update strategy')
    } finally {
      setUpdating(false)
    }
  }

  const executeManually = async () => {
    try {
      setExecuting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/algo/strategy', {
        method: 'POST'
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess(`Execution completed: ${data.data.ordersPlaced} orders placed`)
        await fetchStrategy() // Refresh data
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to execute strategy')
    } finally {
      setExecuting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!strategy || !subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Strategy</h2>
          <p className="text-gray-600 mb-4">{error || 'Please try again later'}</p>
          <button 
            onClick={fetchStrategy}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Algorithmic Trading</h1>
          <p className="text-gray-600 mt-2">
            Educational paper trading with Moving Average Crossover strategy
          </p>
        </div>

        {/* Subscription Status */}
        {!subscription.isActive && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-yellow-900">Pro Subscription Required</h3>
                  <p className="text-sm text-yellow-700">
                    Upgrade to Algo Trading Pro (₹199/month) to enable algorithmic trading execution
                  </p>
                </div>
              </div>
              <Link 
                href="/algo-trading/subscribe" 
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Upgrade to Algo Pro (₹199/month) →
              </Link>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategy Configuration */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Moving Average Crossover Strategy</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    strategy.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {strategy.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={toggleStrategy}
                    disabled={updating || !subscription.isActive}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      subscription.isActive
                        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {updating ? 'Updating...' : (strategy.isActive ? 'Disable' : 'Enable')}
                  </button>
                </div>
              </div>

              {/* Educational Content */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📚 How This Strategy Works</h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong>Educational Purpose:</strong> This is a learning-focused paper trading strategy. No real money is involved.</p>
                  <p><strong>Strategy Logic:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Uses {strategy.parameters.shortMA}-period and {strategy.parameters.longMA}-period moving averages</li>
                    <li>BUY signal when short MA crosses above long MA</li>
                    <li>SELL signal when short MA crosses below long MA</li>
                    <li>One position per symbol at a time</li>
                    <li>All trades are simulated with virtual money</li>
                  </ul>
                </div>
              </div>

              {/* Strategy Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Short MA Period</div>
                  <div className="text-2xl font-bold">{strategy.parameters.shortMA}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Long MA Period</div>
                  <div className="text-2xl font-bold">{strategy.parameters.longMA}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Quantity per Trade</div>
                  <div className="text-2xl font-bold">{strategy.parameters.quantity}</div>
                </div>
              </div>

              {/* Symbols */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Tracked Symbols</h3>
                <div className="flex flex-wrap gap-2">
                  {strategy.symbols.map((symbol) => (
                    <span 
                      key={symbol}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>

              {/* Last Signal */}
              {strategy.lastSignal && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Last Signal</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Symbol</div>
                        <div className="font-semibold">{strategy.lastSignal.symbol}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Signal</div>
                        <div className={`font-semibold ${
                          strategy.lastSignal.signal === 'BUY' ? 'text-green-600' :
                          strategy.lastSignal.signal === 'SELL' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {strategy.lastSignal.signal}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Price</div>
                        <div className="font-semibold">₹{strategy.lastSignal.price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Time</div>
                        <div className="font-semibold">
                          {new Date(strategy.lastSignal.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Execution */}
              {subscription.isActive && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Manual Execution</h3>
                      <p className="text-sm text-gray-600">Run the strategy immediately (for testing)</p>
                    </div>
                    <button
                      onClick={executeManually}
                      disabled={executing || !strategy.isActive}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {executing ? 'Executing...' : 'Execute Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance & Status */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Performance (Virtual)</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trades</span>
                  <span className="font-semibold">{strategy.performance.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Winning Trades</span>
                  <span className="font-semibold">{strategy.performance.winningTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Win Rate</span>
                  <span className="font-semibold">
                    {strategy.performance.totalTrades > 0 
                      ? `${((strategy.performance.winningTrades / strategy.performance.totalTrades) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Virtual P&L</span>
                  <span className={`font-semibold ${
                    strategy.performance.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{strategy.performance.totalPnL.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Open Positions</span>
                  <span className="font-semibold">{strategy.performance.currentPositions}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Run</span>
                  <span className="text-sm">
                    {strategy.lastRun 
                      ? new Date(strategy.lastRun).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscription</span>
                  <span className={`text-sm font-medium ${
                    subscription.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
                {subscription.isActive && subscription.daysRemaining && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Remaining</span>
                    <span className="text-sm">{subscription.daysRemaining}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Educational Disclaimer</h4>
              <p className="text-xs text-yellow-700">
                This is a paper trading simulator for educational purposes only. 
                No real money is involved. Past performance does not guarantee future results. 
                This is not financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}