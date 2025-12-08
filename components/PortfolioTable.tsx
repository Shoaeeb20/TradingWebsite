'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Holding {
  symbol: string
  quantity: number
  avgPrice: number
}

interface HoldingWithPrice extends Holding {
  currentPrice?: number
  pnl?: number
  pnlPercent?: number
}

export default function PortfolioTable({ holdings }: { holdings: Holding[] }) {
  const [enrichedHoldings, setEnrichedHoldings] = useState<HoldingWithPrice[]>(holdings)

  useEffect(() => {
    const fetchPrices = async () => {
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
    }

    if (holdings.length > 0) {
      fetchPrices()
    }
  }, [holdings])

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
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Symbol</th>
            <th className="text-right py-3">Quantity</th>
            <th className="text-right py-3">Avg Price</th>
            <th className="text-right py-3">Current Price</th>
            <th className="text-right py-3">P&L</th>
            <th className="text-right py-3">P&L %</th>
          </tr>
        </thead>
        <tbody>
          {enrichedHoldings.map((holding) => (
            <tr key={holding.symbol} className="border-b hover:bg-gray-50">
              <td className="py-3">
                <Link href={`/market/${holding.symbol}`} className="font-semibold text-primary hover:underline">
                  {holding.symbol}
                </Link>
              </td>
              <td className="text-right">{holding.quantity}</td>
              <td className="text-right">₹{holding.avgPrice.toFixed(2)}</td>
              <td className="text-right">
                {holding.currentPrice ? `₹${holding.currentPrice.toFixed(2)}` : '—'}
              </td>
              <td className={`text-right font-semibold ${holding.pnl && holding.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                {holding.pnl
                  ? `${holding.pnl >= 0 ? '+' : ''}₹${holding.pnl.toFixed(2)}`
                  : '—'}
              </td>
              <td className={`text-right ${holding.pnlPercent && holding.pnlPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {holding.pnlPercent
                  ? `${holding.pnlPercent >= 0 ? '+' : ''}${holding.pnlPercent.toFixed(2)}%`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
