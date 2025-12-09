'use client'

import { useEffect, useState } from 'react'

interface Holding {
  symbol: string
  quantity: number
  avgPrice: number
}

interface PortfolioSummaryProps {
  balance: number
  holdings: Holding[]
}

export default function PortfolioSummary({ balance, holdings }: PortfolioSummaryProps) {
  const [totalValue, setTotalValue] = useState(balance)
  const [pnl, setPnl] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true)
      let invested = 0
      let current = 0

      for (const holding of holdings) {
        invested += holding.avgPrice * holding.quantity

        try {
          const res = await fetch(`/api/stocks/price?symbol=${holding.symbol}`)
          const data = await res.json()
          if (data.price) {
            current += data.price * holding.quantity
          }
        } catch (error) {
          console.error(`Failed to fetch price for ${holding.symbol}`)
        }
      }

      const holdingsValue = current
      const totalPnl = current - invested

      setTotalValue(balance + holdingsValue)
      setPnl(totalPnl)
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
  }, [holdings, balance])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <div className="text-sm text-gray-600">Total Portfolio Value</div>
        {loading ? (
          <div className="h-9 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <div className="text-3xl font-bold text-primary">
            ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        )}
      </div>

      <div className="card">
        <div className="text-sm text-gray-600">Available Balance</div>
        <div className="text-3xl font-bold">
          ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="card">
        <div className="text-sm text-gray-600">Total P&L</div>
        {loading ? (
          <div className="h-9 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <div className={`text-3xl font-bold ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
            {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        )}
      </div>
    </div>
  )
}
