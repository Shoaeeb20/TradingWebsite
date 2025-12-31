'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface QuickTradeButtonProps {
  symbol: string
  name: string
  amount: number
  type: 'BUY' | 'SELL'
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onSuccess?: () => void
}

export default function QuickTradeButton({
  symbol,
  name,
  amount,
  type,
  variant = 'primary',
  size = 'md',
  onSuccess
}: QuickTradeButtonProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getVariantClasses = () => {
    const baseClasses = 'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    
    switch (variant) {
      case 'success':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`
      case 'danger':
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white`
      case 'secondary':
        return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white`
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-6 py-4 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  const handleQuickTrade = async () => {
    if (!session?.user?.email) {
      setError('Please login to trade')
      return
    }

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
          type,
          orderType: 'MARKET',
          quantity: Math.floor(amount / 100), // Rough calculation
          productType: 'INTRADAY'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setLoading(false)
        
        // Check for achievements after successful trade
        fetch('/api/user/achievements', { method: 'POST' })
          .then(res => res.json())
          .then(achievementData => {
            if (achievementData.success && achievementData.data.newAchievements.length > 0) {
              console.log('New achievements unlocked:', achievementData.data.newAchievements)
              // You could show a celebration modal here
            }
          })
          .catch(console.error)
        
        // Show success animation for 1.5 seconds
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
        }, 1500)
      } else {
        setError(data.error || data.message || 'Trade failed')
        setLoading(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <button
        className={`${getSizeClasses()} bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 animate-pulse`}
        disabled
      >
        <span className="animate-bounce text-lg">🎉</span>
        <span className="font-bold">
          {type === 'BUY' ? 'Bought!' : 'Sold!'}
        </span>
        <span className="animate-bounce text-lg">✨</span>
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleQuickTrade}
        disabled={loading}
        className={`${getVariantClasses()} ${getSizeClasses()} rounded-lg flex items-center justify-center gap-2 w-full`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {type === 'BUY' ? 'Buying...' : 'Selling...'}
          </>
        ) : (
          <>
            {type === 'BUY' ? '🛒' : '💰'}
            {type} ₹{amount.toLocaleString()}
          </>
        )}
      </button>
      
      {error && (
        <p className="text-red-600 text-xs text-center">{error}</p>
      )}
      
      <p className="text-xs text-gray-500 text-center">
        {name} • {type === 'BUY' ? 'Quick Buy' : 'Quick Sell'}
      </p>
    </div>
  )
}