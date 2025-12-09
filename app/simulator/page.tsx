'use client'

import { useState } from 'react'
import Link from 'next/link'

const STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
  'BHARTIARTL', 'KOTAKBANK', 'LT', 'AXISBANK', 'ASIANPAINT', 'MARUTI', 'TITAN',
  'SUNPHARMA', 'ULTRACEMCO', 'BAJFINANCE', 'NESTLEIND', 'WIPRO'
]

const NEGATIVE_EVENTS = [
  { id: 'bad-earnings', label: 'Bad Earnings Report', impact: -3.5, explanation: 'Disappointing quarterly results create selling pressure as investors lose confidence in growth prospects.' },
  { id: 'ceo-resign', label: 'CEO Resignation', impact: -2.8, explanation: 'Leadership uncertainty causes market anxiety. Traders expect instability and potential strategic shifts.' },
  { id: 'fraud', label: 'Fraud Allegation', impact: -8.2, explanation: 'Serious allegations trigger panic selling. Institutional investors exit positions to avoid reputational risk.' },
  { id: 'rbi-hike', label: 'RBI Rate Hike', impact: -1.5, explanation: 'Higher interest rates increase borrowing costs, reducing profit margins and dampening growth expectations.' },
  { id: 'poor-guidance', label: 'Poor Future Guidance', impact: -4.1, explanation: 'Weak forward outlook signals trouble ahead. Market reprices stock based on lower future earnings.' },
  { id: 'lawsuit', label: 'Major Lawsuit Filed', impact: -3.2, explanation: 'Legal battles create uncertainty about future liabilities and potential financial penalties.' },
  { id: 'cyberattack', label: 'Cyberattack Reported', impact: -2.5, explanation: 'Security breaches damage reputation and raise concerns about data protection and operational risks.' },
  { id: 'profit-warning', label: 'Profit Warning Issued', impact: -5.8, explanation: 'Pre-announcement of weak results triggers immediate selling as traders adjust expectations downward.' }
]

const POSITIVE_EVENTS = [
  { id: 'big-order', label: 'Big Order Received', impact: 4.2, explanation: 'Major contract win boosts revenue visibility. Market rewards strong business development and competitive positioning.' },
  { id: 'strong-earnings', label: 'Strong Earnings Beat', impact: 5.5, explanation: 'Better-than-expected results validate growth story. Momentum traders and institutions add positions.' },
  { id: 'new-ceo', label: 'Star CEO Appointed', impact: 3.1, explanation: 'Proven leadership brings optimism. Market anticipates strategic improvements and operational excellence.' },
  { id: 'rbi-cut', label: 'RBI Rate Cut', impact: 2.3, explanation: 'Lower rates reduce borrowing costs and boost liquidity. Growth stocks benefit from improved valuations.' },
  { id: 'product-launch', label: 'Blockbuster Product Launch', impact: 6.8, explanation: 'Innovative product creates new revenue stream. Market prices in future growth potential and market share gains.' },
  { id: 'partnership', label: 'Global Partnership Announced', impact: 4.5, explanation: 'Strategic alliance opens new markets and validates technology. Institutional interest increases significantly.' },
  { id: 'expansion', label: 'Major Expansion Plan', impact: 3.7, explanation: 'Capacity expansion signals confidence in demand. Market rewards aggressive growth strategy.' },
  { id: 'good-guidance', label: 'Strong Future Guidance', impact: 4.9, explanation: 'Optimistic outlook raises earnings estimates. Analysts upgrade ratings and price targets.' }
]

export default function SimulatorPage() {
  const [stock, setStock] = useState('')
  const [event, setEvent] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSimulate = () => {
    if (!stock || !event) return

    setLoading(true)
    
    setTimeout(() => {
      const selectedEvent = [...NEGATIVE_EVENTS, ...POSITIVE_EVENTS].find(e => e.id === event)!
      const isNegative = selectedEvent.impact < 0
      const volumeSpike = Math.floor(Math.random() * 150) + 100
      const volatility = Math.floor(Math.random() * 50) + 20
      const bullish = isNegative ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 30) + 60
      const bearish = 100 - bullish

      setResult({
        stock,
        event: selectedEvent.label,
        priceChange: selectedEvent.impact,
        volumeSpike,
        volatility,
        bullish,
        bearish,
        explanation: selectedEvent.explanation
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Educational Game Only:</strong> This is a fun simulator with fictional scenarios. For real stock trading with actual market data, visit <Link href="/market" className="underline font-semibold">Market</Link> or <Link href="/portfolio" className="underline font-semibold">Portfolio</Link> pages.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📰 News Impact Simulator</h1>
        <p className="text-gray-600 mb-4">See how different news events might affect stock prices. Learn market psychology through interactive scenarios!</p>
        <div className="flex gap-3">
          <Link href="/simulator/challenge" className="btn btn-primary">
            ⚡ 60s Challenge
          </Link>
          <Link href="/simulator/live-trading" className="btn btn-primary">
            📈 Live Trading
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Setup Your Scenario</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Step 1: Choose a Stock</label>
              <select 
                value={stock} 
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select a stock...</option>
                {STOCKS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Step 2: Choose a News Event</label>
              
              <div className="mb-3">
                <p className="text-xs font-semibold text-red-600 mb-1">🚨 NEGATIVE EVENTS</p>
                <select 
                  value={event} 
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select negative event...</option>
                  {NEGATIVE_EVENTS.map(e => (
                    <option key={e.id} value={e.id}>{e.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-green-600 mb-1">🚀 POSITIVE EVENTS</p>
                <select 
                  value={event} 
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select positive event...</option>
                  {POSITIVE_EVENTS.map(e => (
                    <option key={e.id} value={e.id}>{e.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={!stock || !event || loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Simulating Market Reaction...' : '🎯 Simulate Market Reaction'}
            </button>
          </div>
        </div>

        <div className="card">
          {!result ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Select a stock and event to see the simulation</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-lg font-bold">{result.stock}</h3>
                <p className="text-sm text-gray-600">{result.event}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Price Reaction</div>
                <div className={`text-4xl font-bold ${result.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.priceChange >= 0 ? '+' : ''}{result.priceChange}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600">Volume Spike</div>
                  <div className="text-2xl font-bold text-orange-600">+{result.volumeSpike}%</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600">Volatility</div>
                  <div className="text-2xl font-bold text-purple-600">+{result.volatility}%</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Market Sentiment</div>
                <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                  <div 
                    className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${result.bearish}%` }}
                  >
                    {result.bearish}% 🔴
                  </div>
                  <div 
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${result.bullish}%` }}
                  >
                    {result.bullish}% 🟢
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-blue-900 mb-2">🧠 Why This Happens:</div>
                <p className="text-sm text-blue-800">{result.explanation}</p>
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Try Another Scenario
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="font-bold mb-1">Learn Market Psychology</h3>
          <p className="text-sm text-gray-600">Understand how news drives trader behavior and price movements</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">🎮</div>
          <h3 className="font-bold mb-1">Risk-Free Practice</h3>
          <p className="text-sm text-gray-600">Experiment with scenarios without any real money at stake</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">💡</div>
          <h3 className="font-bold mb-1">Build Intuition</h3>
          <p className="text-sm text-gray-600">Develop instincts for how markets react to different events</p>
        </div>
      </div>
    </div>
  )
}
