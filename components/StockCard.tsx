'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import QuickTradeButton from './QuickTradeButton'

interface StockCardProps {
  symbol: string
  name: string
  showQuickTrade?: boolean
}

export default function StockCard({ symbol, name, showQuickTrade = false }: StockCardProps) {
  const { data: session } = useSession()
  const [price, setPrice] = useState<number | null>(null)
  const [change, setChange] = useState<number | null>(null)
  const [changePercent, setChangePercent] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/stocks/price?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.price) {
          setPrice(data.price)
          setChange(data.change)
          setChangePercent(data.changePercent)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [symbol])

  const handleQuickTradeSuccess = () => {
    // Refresh price data after successful trade
    fetch(`/api/stocks/price?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.price) {
          setPrice(data.price)
          setChange(data.change)
          setChangePercent(data.changePercent)
        }
      })
      .catch(console.error)
  }

  return (
    <div 
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{name}</p>
        </div>
        {loading ? (
          <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
        ) : price ? (
          <div className="text-right">
            <div className="font-bold">₹{price.toFixed(2)}</div>
            {change !== null && (
              <div className={`text-sm ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                {change >= 0 ? '+' : ''}
                {change.toFixed(2)} ({changePercent?.toFixed(2)}%)
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Quick Trade Buttons - Show on hover or if showQuickTrade is true */}
      {showQuickTrade && session && price && (showButtons || showQuickTrade) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <QuickTradeButton
              symbol={symbol}
              name={name}
              amount={Math.round(price * 10)} // 10 shares worth
              type="BUY"
              variant="success"
              size="sm"
              onSuccess={handleQuickTradeSuccess}
            />
            <QuickTradeButton
              symbol={symbol}
              name={name}
              amount={Math.round(price * 5)} // 5 shares worth
              type="SELL"
              variant="danger"
              size="sm"
              onSuccess={handleQuickTradeSuccess}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">
            Quick trade • Virtual money
          </p>
        </div>
      )}

      {/* Login prompt for non-authenticated users */}
      {showQuickTrade && !session && (showButtons || showQuickTrade) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <a 
            href="/auth/signin"
            className="block w-full text-center bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Sign in to trade
          </a>
        </div>
      )}
    </div>
  )
}
