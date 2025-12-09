'use client'

import { useEffect, useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function StockChart({ symbol }: { symbol: string }) {
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState('1M')
  const [timeframeStats, setTimeframeStats] = useState({ change: 0, changePercent: 0, startPrice: 0 })
  const [showMA20, setShowMA20] = useState(true)
  const [showMA50, setShowMA50] = useState(true)

  useEffect(() => {
    const fetchPrice = () => {
      fetch(`/api/stocks/price?symbol=${symbol}`)
        .then((res) => res.json())
        .then((data) => {
          setQuote(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 120000)

    return () => clearInterval(interval)
  }, [symbol])

  useEffect(() => {
    if (!quote) return
    
    const rangeMap = { '1D': '1d', '1W': '5d', '1M': '1mo', '3M': '3mo' }
    const range = rangeMap[timeframe as keyof typeof rangeMap]
    
    fetch(`/api/stocks/history?symbol=${symbol}&range=${range}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((d: any) => {
            const date = new Date(d.time)
            let label = ''
            if (timeframe === '1D') label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
            else if (timeframe === '1W') label = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
            else label = `${date.getDate()}/${date.getMonth() + 1}`
            
            return {
              time: label,
              open: parseFloat(d.open?.toFixed(2) || d.price.toFixed(2)),
              high: parseFloat(d.high?.toFixed(2) || d.price.toFixed(2)),
              low: parseFloat(d.low?.toFixed(2) || d.price.toFixed(2)),
              close: parseFloat(d.price.toFixed(2)),
              volume: d.volume
            }
          })

          // Calculate Moving Averages
          const withMA = formatted.map((item: any, idx: number) => {
            const ma20 = idx >= 19 
              ? formatted.slice(idx - 19, idx + 1).reduce((sum: number, d: any) => sum + d.close, 0) / 20
              : null
            const ma50 = idx >= 49
              ? formatted.slice(idx - 49, idx + 1).reduce((sum: number, d: any) => sum + d.close, 0) / 50
              : null
            
            return {
              ...item,
              ma20: ma20 ? parseFloat(ma20.toFixed(2)) : null,
              ma50: ma50 ? parseFloat(ma50.toFixed(2)) : null
            }
          })
          
          setChartData(withMA)
          
          const startPrice = withMA[0].close
          const endPrice = withMA[withMA.length - 1].close
          const change = endPrice - startPrice
          const changePercent = (change / startPrice) * 100
          
          setTimeframeStats({
            change,
            changePercent,
            startPrice
          })
        }
      })
      .catch(() => {})
  }, [symbol, timeframe, quote])

  if (loading) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading chart...</p>
        </div>
      </div>
    )
  }

  if (!quote || !quote.price) {
    return <div className="card h-96 flex items-center justify-center text-gray-500">Price unavailable</div>
  }

  const isPositive = timeframeStats.changePercent >= 0

  const CandlestickBar = (props: any) => {
    const { x, y, width, payload } = props
    const { open, close, high, low } = payload
    
    if (!open || !close || !high || !low) return null
    
    const isGreen = close > open
    const color = isGreen ? '#10b981' : '#ef4444'
    const bodyHeight = Math.abs(close - open) * (props.height / (props.yMax - props.yMin))
    const bodyY = Math.min(close, open) * (props.height / (props.yMax - props.yMin))
    
    return (
      <g>
        <line
          x1={x + width / 2}
          y1={y + (props.yMax - high) * (props.height / (props.yMax - props.yMin))}
          x2={x + width / 2}
          y2={y + (props.yMax - low) * (props.height / (props.yMax - props.yMin))}
          stroke={color}
          strokeWidth={1}
        />
        <rect
          x={x + width * 0.2}
          y={y + (props.yMax - Math.max(close, open)) * (props.height / (props.yMax - props.yMin))}
          width={width * 0.6}
          height={Math.max(bodyHeight, 1)}
          fill={color}
          stroke={color}
        />
      </g>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-4xl font-bold">₹{quote.price.toFixed(2)}</div>
          <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{timeframeStats.change.toFixed(2)} ({timeframeStats.changePercent.toFixed(2)}%)
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {timeframe} • {quote.cached ? 'Cached' : 'Live'} • Delayed 15 min
          </div>
        </div>
        
        <div className="flex gap-1">
          {['1D', '1W', '1M', '3M'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs rounded ${
                timeframe === tf 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-2 text-xs">
        <button
          onClick={() => setShowMA20(!showMA20)}
          className={`px-2 py-1 rounded ${showMA20 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}
        >
          MA20
        </button>
        <button
          onClick={() => setShowMA50(!showMA50)}
          className={`px-2 py-1 rounded ${showMA50 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
        >
          MA50
        </button>
      </div>

      <div className="h-80 -mx-2">
        <ResponsiveContainer width="100%" height="70%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              stroke="#d1d5db"
              tickLine={false}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']} 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#d1d5db"
              tickLine={false}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                padding: '8px 12px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'ma20') return [`₹${value.toFixed(2)}`, 'MA20']
                if (name === 'ma50') return [`₹${value.toFixed(2)}`, 'MA50']
                return [`₹${value.toFixed(2)}`, name]
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke={isPositive ? '#10b981' : '#ef4444'} 
              strokeWidth={2}
              dot={false}
              name="Close"
            />
            {showMA20 && (
              <Line 
                type="monotone" 
                dataKey="ma20" 
                stroke="#f97316" 
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 5"
                name="MA20"
              />
            )}
            {showMA50 && (
              <Line 
                type="monotone" 
                dataKey="ma50" 
                stroke="#a855f7" 
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 5"
                name="MA50"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="30%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              stroke="#d1d5db"
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#d1d5db"
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                padding: '8px 12px'
              }}
              formatter={(value: number) => [(value / 1000000).toFixed(2) + 'M', 'Volume']}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Bar dataKey="volume" fill="#94a3b8" opacity={0.6} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t text-sm">
        <div>
          <div className="text-gray-500 text-xs">Open</div>
          <div className="font-semibold">₹{timeframeStats.startPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">High</div>
          <div className="font-semibold text-green-600">₹{chartData.length > 0 ? Math.max(...chartData.map(d => d.high)).toFixed(2) : '0'}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Low</div>
          <div className="font-semibold text-red-600">₹{chartData.length > 0 ? Math.min(...chartData.map(d => d.low)).toFixed(2) : '0'}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Volume</div>
          <div className="font-semibold">{chartData.length > 0 ? (chartData[chartData.length - 1].volume / 1000000).toFixed(1) : '0'}M</div>
        </div>
      </div>
    </div>
  )
}
