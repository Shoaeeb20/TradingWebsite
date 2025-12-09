'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Holding {
  symbol: string
  quantity: number
  avgPrice: number
  productType: string
}

interface HoldingWithPrice extends Holding {
  currentPrice?: number
  pnl?: number
  pnlPercent?: number
}

export default function PortfolioTable({ holdings, userId }: { holdings: Holding[], userId: string }) {
  const [selling, setSelling] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [enrichedHoldings, setEnrichedHoldings] = useState<HoldingWithPrice[]>(holdings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true)
      const updated = await Promise.all(
        holdings.map(async (holding) => {
          try {
            const res = await fetch(`/api/stocks/price?symbol=${holding.symbol}`)
            const data = await res.json()
            if (data.price) {
              const pnl = (data.price - holding.avgPrice) * holding.quantity
              const pnlPercent = ((data.price - holding.avgPrice) / holding.avgPrice) * 100
              return { ...holding, currentPrice: data.price, pnl, pnlPercent }
            }
          } catch (error) {
            console.error(`Failed to fetch price for ${holding.symbol}`)
          }
          return holding
        })
      )
      setEnrichedHoldings(updated)
      setLoading(false)
    }

    if (holdings.length > 0) {
      fetchPrices()
      
      // Auto-refresh prices every 2 minutes
      const interval = setInterval(fetchPrices, 2 * 60 * 1000)
      return () => clearInterval(interval)
    } else {
      setLoading(false)
    }
  }, [holdings])

  const handleSell = async (holding: HoldingWithPrice) => {
    const key = `${holding.symbol}-${holding.productType}`
    setSelling(key)
    setMessage('')

    const isShort = holding.quantity < 0
    const absQuantity = Math.abs(holding.quantity)

    try {
      const res = await fetch('/api/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: holding.symbol,
          type: isShort ? 'BUY' : 'SELL',
          orderType: 'MARKET',
          productType: holding.productType,
          quantity: absQuantity,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(`✓ ${isShort ? 'Covered' : 'Sold'} ${absQuantity} ${holding.symbol} successfully`)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage(`✗ ${data.error}`)
      }
    } catch (error) {
      setMessage('✗ Failed to execute')
    }

    setSelling(null)
  }

  if (holdings.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 mb-4">No holdings yet</p>
        <Link href="/market" className="btn btn-primary">
          Explore Market
        </Link>
      </div>
    )
  }

  return (
    <div>
      {message && (
        <div className={`mb-4 p-3 rounded ${message.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Symbol</th>
            <th className="text-right py-3">Qty</th>
            <th className="text-right py-3">Type</th>
            <th className="text-right py-3">Avg Price</th>
            <th className="text-right py-3">Current</th>
            <th className="text-right py-3">P&L</th>
            <th className="text-right py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrichedHoldings.map((holding) => {
            const key = `${holding.symbol}-${holding.productType}`
            const isShort = holding.quantity < 0
            const absQuantity = Math.abs(holding.quantity)
            return (
              <tr key={key} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  <Link href={`/market/${holding.symbol}`} className="font-semibold text-primary hover:underline">
                    {holding.symbol}
                  </Link>
                  {isShort && <span className="ml-2 text-xs text-red-600 font-semibold">(SHORT)</span>}
                </td>
                <td className="text-right">{isShort ? `-${absQuantity}` : holding.quantity}</td>
                <td className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${holding.productType === 'INTRADAY' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {holding.productType}
                  </span>
                </td>
                <td className="text-right">₹{holding.avgPrice.toFixed(2)}</td>
                <td className="text-right">
                  {loading ? (
                    <div className="h-5 w-16 bg-gray-200 animate-pulse rounded inline-block"></div>
                  ) : holding.currentPrice ? (
                    `₹${holding.currentPrice.toFixed(2)}`
                  ) : (
                    '—'
                  )}
                </td>
                <td className={`text-right font-semibold ${holding.pnl && holding.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                  {loading ? (
                    <div className="h-5 w-20 bg-gray-200 animate-pulse rounded inline-block"></div>
                  ) : holding.pnl ? (
                    `${holding.pnl >= 0 ? '+' : ''}₹${holding.pnl.toFixed(2)}`
                  ) : (
                    '—'
                  )}
                </td>
                <td className="text-right">
                  <button
                    onClick={() => handleSell(holding)}
                    disabled={selling === key}
                    className={`text-xs px-3 py-1 rounded hover:opacity-90 disabled:opacity-50 ${isShort ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                  >
                    {selling === key ? 'Processing...' : (isShort ? 'Cover' : 'Sell')}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    </div>
  )
}
