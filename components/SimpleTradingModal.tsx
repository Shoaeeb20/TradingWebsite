'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface SimpleTradingModalProps {
  isOpen: boolean
  onClose: () => void
  symbol: string
  name: string
  currentPrice?: number
}

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000]

export default function SimpleTradingModal({
  isOpen,
  onClose,
  symbol,
  name,
  currentPrice = 100
}: SimpleTradingModalProps) {
  const { data: session } = useSession()
  const [selectedAmount, setSelectedAmount] = useState(5000)
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrade = async () => {
    if (!session?.user?.email) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/order/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          type: tradeType,
          orderType: 'MARKET',
          quantity: Math.floor(selectedAmount / currentPrice),
          productType: 'INTRADAY'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setLoading(false)
        
        // Show success for 2 seconds then close
        setTimeout(() => {
          setSuccess(false)
          onClose()
        }, 2000)
      } else {
        setError(data.error || data.message || 'Trade failed')
        setLoading(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Trade Successful!
            </h2>
            <p className="text-green-700 mb-4">
              You {tradeType === 'BUY' ? 'bought' : 'sold'} {symbol} worth ₹{selectedAmount.toLocaleString()}
            </p>
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✨ Great job! Keep trading to improve your skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quick Trade</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg">{symbol}</h3>
          <p className="text-gray-600 text-sm">{name}</p>
          <p className="text-sm text-gray-500">Current Price: ₹{currentPrice.toFixed(2)}</p>
        </div>

        {/* Trade Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Trade Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTradeType('BUY')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                tradeType === 'BUY'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🛒 BUY
            </button>
            <button
              onClick={() => setTradeType('SELL')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                tradeType === 'SELL'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💰 SELL
            </button>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Investment Amount</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedAmount === amount
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ₹{amount.toLocaleString()}
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              Estimated Quantity: ~{Math.floor(selectedAmount / currentPrice)} shares
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              tradeType === 'BUY'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {tradeType === 'BUY' ? 'Buying...' : 'Selling...'}
              </div>
            ) : (
              `${tradeType} ₹${selectedAmount.toLocaleString()}`
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          💡 This is paper trading with virtual money. No real money is involved.
        </p>
      </div>
    </div>
  )
}