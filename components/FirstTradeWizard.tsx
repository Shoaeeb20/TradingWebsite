'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface FirstTradeWizardProps {
  onTradeComplete: () => void
}

const STARTER_STOCKS = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    amount: 5000,
    description: 'Safe blue-chip stock',
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: '🏭'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    amount: 3000,
    description: 'Tech industry leader',
    color: 'bg-green-600 hover:bg-green-700',
    icon: '💻'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    amount: 2000,
    description: 'Popular IT stock',
    color: 'bg-purple-600 hover:bg-purple-700',
    icon: '🚀'
  }
]

export default function FirstTradeWizard({ onTradeComplete }: FirstTradeWizardProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleQuickTrade = async (stock: typeof STARTER_STOCKS[0]) => {
    if (!session?.user?.email) return

    setLoading(stock.symbol)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: stock.symbol,
          type: 'BUY',
          orderType: 'MARKET',
          quantity: Math.floor(stock.amount / 100), // Rough calculation, will be adjusted by backend
          productType: 'INTRADAY'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(stock.symbol)
        setLoading(null)
        
        // Show success for 2 seconds then call completion
        setTimeout(() => {
          onTradeComplete()
        }, 2000)
      } else {
        setError(data.message || 'Trade failed')
        setLoading(null)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(null)
    }
  }

  if (success) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Congratulations! You're now a trader!
          </h2>
          <p className="text-green-700 mb-4">
            You successfully bought {success} shares. Welcome to the world of trading!
          </p>
          <div className="bg-green-100 rounded-lg p-4 inline-block">
            <p className="text-sm text-green-800">
              🎁 <strong>Bonus:</strong> ₹10,000 added to your account for completing your first trade!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          👋 Welcome! Let's make your first trade
        </h2>
        <p className="text-blue-700">
          Choose a stock below and start trading in just one click. It takes 30 seconds!
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STARTER_STOCKS.map((stock) => (
          <div
            key={stock.symbol}
            className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-blue-300 transition-all duration-200"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{stock.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{stock.symbol}</h3>
              <p className="text-sm text-gray-600 mb-2">{stock.name}</p>
              <p className="text-xs text-gray-500 mb-4">{stock.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Investment Amount</p>
                <p className="text-xl font-bold text-gray-900">₹{stock.amount.toLocaleString()}</p>
              </div>

              <button
                onClick={() => handleQuickTrade(stock)}
                disabled={loading === stock.symbol}
                className={`w-full ${stock.color} text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === stock.symbol ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Buying...
                  </div>
                ) : (
                  `Buy ${stock.symbol} Now`
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-blue-600">
          💡 <strong>Don't worry!</strong> This is paper trading with virtual money. No real money is involved.
        </p>
      </div>
    </div>
  )
}