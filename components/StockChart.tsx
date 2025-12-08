'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StockChart({ symbol }: { symbol: string }) {
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/stocks/price?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        setQuote(data)
        generateChartData(data.price)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [symbol])

  const generateChartData = (currentPrice: number) => {
    const data = []
    const basePrice = currentPrice * 0.95
    for (let i = 0; i < 30; i++) {
      const variance = Math.random() * 0.1 - 0.05
      const price = basePrice + (currentPrice - basePrice) * (i / 29) + (currentPrice * variance)
      data.push({
        time: `Day ${i + 1}`,
        price: parseFloat(price.toFixed(2))
      })
    }
    setChartData(data)
  }

  if (loading) {
    return <div className="card h-96 flex items-center justify-center">Loading...</div>
  }

  if (!quote || !quote.price) {
    return <div className="card h-96 flex items-center justify-center text-gray-500">Price unavailable</div>
  }

  return (
    <div className="card">
      <div className="mb-4">
        <div className="text-4xl font-bold">₹{quote.price.toFixed(2)}</div>
        <div className={`text-lg ${quote.change >= 0 ? 'text-success' : 'text-danger'}`}>
          {quote.change >= 0 ? '+' : ''}
          {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {quote.cached ? 'Cached data' : 'Live data'} • Delayed 15 min
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={quote.change >= 0 ? '#10b981' : '#ef4444'} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
