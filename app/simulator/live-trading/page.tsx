'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const STOCKS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK']

export default function LiveTradingPage() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [stock, setStock] = useState('RELIANCE')
  const [cash, setCash] = useState(10000)
  const [position, setPosition] = useState(0)
  const [avgPrice, setAvgPrice] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(1000)
  const [priceHistory, setPriceHistory] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(120)
  const [message, setMessage] = useState('')
  const intervalRef = useRef<any>(null)

  const startGame = () => {
    const startPrice = 1000
    setGameState('playing')
    setCash(10000)
    setPosition(0)
    setAvgPrice(0)
    setCurrentPrice(startPrice)
    setPriceHistory([{ time: 0, price: startPrice }])
    setTimeLeft(120)
    setMessage('')
  }

  const calculatePnL = () => {
    if (position === 0) return 0
    return (currentPrice - avgPrice) * position
  }

  const handleBuy = () => {
    const quantity = 1
    const cost = currentPrice * quantity
    
    if (cash < cost) {
      setMessage('❌ Insufficient cash!')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    const newPosition = position + quantity
    const newAvgPrice = position === 0 ? currentPrice : ((avgPrice * position) + (currentPrice * quantity)) / newPosition
    
    setCash(cash - cost)
    setPosition(newPosition)
    setAvgPrice(newAvgPrice)
    setMessage(`✅ Bought ${quantity} @ ₹${currentPrice.toFixed(2)}`)
    setTimeout(() => setMessage(''), 2000)
  }

  const handleSell = () => {
    if (position <= 0) {
      setMessage('❌ No position to sell!')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    const quantity = 1
    const revenue = currentPrice * quantity
    
    setCash(cash + revenue)
    setPosition(position - quantity)
    if (position - quantity === 0) setAvgPrice(0)
    setMessage(`✅ Sold ${quantity} @ ₹${currentPrice.toFixed(2)}`)
    setTimeout(() => setMessage(''), 2000)
  }

  useEffect(() => {
    if (gameState === 'playing') {
      intervalRef.current = setInterval(() => {
        setPriceHistory(prev => {
          const lastPrice = prev[prev.length - 1].price
          const change = (Math.random() - 0.5) * 20
          const newPrice = Math.max(800, Math.min(1200, lastPrice + change))
          const newTime = prev.length
          
          setCurrentPrice(newPrice)
          
          const newHistory = [...prev, { time: newTime, price: newPrice }]
          return newHistory.length > 120 ? newHistory.slice(-120) : newHistory
        })
      }, 1000)

      return () => clearInterval(intervalRef.current)
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('finished')
            clearInterval(intervalRef.current)
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, timeLeft])

  const finalValue = cash + (position * currentPrice)
  const totalPnL = finalValue - 10000

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-700">
          <strong>Educational Game:</strong> Practice live trading with mock data. For real trading, visit <Link href="/market" className="underline font-semibold">Market</Link>.
        </p>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">📈 Live Trading Simulator</h1>
        <p className="text-gray-600">Trade in real-time as prices move every second!</p>
      </div>

      {gameState === 'idle' && (
        <div className="card text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-4">How to Play</h2>
          <div className="text-left space-y-3 mb-6">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Start with ₹10,000 virtual cash</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Watch the price move up and down every second</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Buy low, sell high to maximize profit</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>You have 2 minutes to make as much profit as possible</span>
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Choose Your Stock</label>
            <select 
              value={stock} 
              onChange={(e) => setStock(e.target.value)}
              className="w-full max-w-xs mx-auto px-4 py-2 border rounded-lg"
            >
              {STOCKS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button onClick={startGame} className="btn btn-primary text-lg px-8 py-3">
            🚀 Start Trading
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">{stock}</div>
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
              ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="card">
              <div className="text-sm text-gray-600">Cash</div>
              <div className="text-2xl font-bold text-green-600">₹{cash.toFixed(2)}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-600">Position</div>
              <div className="text-2xl font-bold text-blue-600">{position} shares</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-600">P&L</div>
              <div className={`text-2xl font-bold ${calculatePnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatePnL() >= 0 ? '+' : ''}₹{calculatePnL().toFixed(2)}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-gray-600">Current Price</div>
                <div className="text-4xl font-bold text-blue-600">₹{currentPrice.toFixed(2)}</div>
              </div>
              {position > 0 && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Avg Buy Price</div>
                  <div className="text-2xl font-bold text-gray-700">₹{avgPrice.toFixed(2)}</div>
                </div>
              )}
            </div>

            <div className="h-80 bg-gray-900 rounded-lg p-4 relative">
              <div className="absolute top-2 left-4 z-10 bg-gray-800/90 px-3 py-1 rounded text-white text-sm font-mono">
                ₹{currentPrice.toFixed(2)}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    hide 
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis 
                    domain={[800, 1200]} 
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    stroke="#374151"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px', 
                      color: '#fff',
                      fontSize: '12px',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                    cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={false}
                    fill="url(#priceGradient)"
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="absolute bottom-2 left-4 flex gap-4 text-xs text-gray-400">
                <div>High: ₹{Math.max(...priceHistory.map(p => p.price)).toFixed(2)}</div>
                <div>Low: ₹{Math.min(...priceHistory.map(p => p.price)).toFixed(2)}</div>
                <div>Range: ₹{(Math.max(...priceHistory.map(p => p.price)) - Math.min(...priceHistory.map(p => p.price))).toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button onClick={handleBuy} className="py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xl">
                📈 BUY (1 share)
              </button>
              <button onClick={handleSell} className="py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xl">
                📉 SELL (1 share)
              </button>
            </div>

            {message && (
              <div className={`text-center py-2 rounded-lg font-semibold ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="card text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">{totalPnL >= 0 ? '🎉' : '😅'}</div>
          <h2 className={`text-3xl font-bold mb-2 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 500 ? 'Excellent Trader!' : totalPnL >= 200 ? 'Good Job!' : totalPnL >= 0 ? 'Not Bad!' : 'Keep Practicing!'}
          </h2>
          
          <div className="text-5xl font-bold text-blue-600 mb-6">
            {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toFixed(2)}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Final Cash</div>
              <div className="text-xl font-bold">₹{cash.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Final Position</div>
              <div className="text-xl font-bold">{position} shares</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Value</div>
              <div className="text-xl font-bold">₹{finalValue.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={startGame} className="btn btn-primary w-full text-lg">
              🔄 Play Again
            </button>
            <Link href="/simulator" className="block w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              ← Back to Simulator
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Buy when price dips, sell when it rises. Timing is everything!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
