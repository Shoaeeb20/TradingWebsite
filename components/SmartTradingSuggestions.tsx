'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import QuickTradeButton from './QuickTradeButton'

interface TradingSuggestion {
  symbol: string
  name: string
  reason: string
  type: 'BUY' | 'SELL'
  amount: number
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  icon: string
}

const TRADING_SUGGESTIONS: TradingSuggestion[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    reason: 'Strong fundamentals, good for beginners',
    type: 'BUY',
    amount: 5000,
    confidence: 'HIGH',
    icon: '🏭'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    reason: 'Tech sector leader, stable growth',
    type: 'BUY',
    amount: 3000,
    confidence: 'HIGH',
    icon: '💻'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    reason: 'Popular IT stock, good liquidity',
    type: 'BUY',
    amount: 2000,
    confidence: 'MEDIUM',
    icon: '🚀'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    reason: 'Banking sector strength',
    type: 'BUY',
    amount: 4000,
    confidence: 'HIGH',
    icon: '🏦'
  }
]

interface SmartTradingSuggestionsProps {
  userProgress?: {
    hasFirstTrade: boolean
    totalTrades: number
  }
}

export default function SmartTradingSuggestions({ userProgress }: SmartTradingSuggestionsProps) {
  const { data: session } = useSession()
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Auto-rotate suggestions every 10 seconds
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % TRADING_SUGGESTIONS.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Don't show if user is very active (more than 10 trades)
  if (!session || dismissed || (userProgress && userProgress.totalTrades > 10)) {
    return null
  }

  const suggestion = TRADING_SUGGESTIONS[currentSuggestion]
  const isNewUser = !userProgress?.hasFirstTrade

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h3 className="font-bold text-purple-900">
            {isNewUser ? 'Suggested First Trade' : 'Smart Trading Suggestion'}
          </h3>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-purple-400 hover:text-purple-600 text-xl"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Stock Info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{suggestion.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900">{suggestion.symbol}</h4>
              <p className="text-sm text-gray-600">{suggestion.name}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              suggestion.confidence === 'HIGH' 
                ? 'bg-green-100 text-green-800'
                : suggestion.confidence === 'MEDIUM'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {suggestion.confidence}
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3">
            💡 <strong>Why this stock?</strong> {suggestion.reason}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>💰 Amount: ₹{suggestion.amount.toLocaleString()}</span>
            <span>📊 Type: {suggestion.type}</span>
            <span>⏱️ Suggestion {currentSuggestion + 1} of {TRADING_SUGGESTIONS.length}</span>
          </div>
        </div>

        {/* Quick Trade Button */}
        <div className="flex flex-col gap-2">
          <QuickTradeButton
            symbol={suggestion.symbol}
            name={suggestion.name}
            amount={suggestion.amount}
            type={suggestion.type}
            variant={suggestion.type === 'BUY' ? 'success' : 'danger'}
            size="lg"
          />
          
          {isNewUser && (
            <p className="text-xs text-center text-purple-600">
              🎁 Get ₹10,000 bonus after first trade!
            </p>
          )}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mt-4 gap-1">
        {TRADING_SUGGESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSuggestion(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSuggestion ? 'bg-purple-600' : 'bg-purple-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}