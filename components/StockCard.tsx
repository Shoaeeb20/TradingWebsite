'use client'

import { useEffect, useState } from 'react'

interface StockCardProps {
  symbol: string
  name: string
}

export default function StockCard({ symbol, name }: StockCardProps) {
  const [price, setPrice] = useState<number | null>(null)
  const [change, setChange] = useState<number | null>(null)
  const [changePercent, setChangePercent] = useState<number | null>(null)

  useEffect(() => {
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
  }, [symbol])

  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{name}</p>
        </div>
        {price && (
          <div className="text-right">
            <div className="font-bold">₹{price.toFixed(2)}</div>
            {change !== null && (
              <div className={`text-sm ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                {change >= 0 ? '+' : ''}
                {change.toFixed(2)} ({changePercent?.toFixed(2)}%)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
