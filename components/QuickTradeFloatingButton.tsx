'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import SimpleTradingModal from './SimpleTradingModal'

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2500 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3200 },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1400 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1600 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 900 }
]

export default function QuickTradeFloatingButton() {
  const { data: session } = useSession()
  const [showStocks, setShowStocks] = useState(false)
  const [selectedStock, setSelectedStock] = useState<typeof POPULAR_STOCKS[0] | null>(null)

  if (!session) return null

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowStocks(!showStocks)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
          title="Quick Trade"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </button>

        {/* Quick Stock Selection */}
        {showStocks && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 w-64">
            <h3 className="font-semibold mb-3 text-gray-900">⚡ Quick Trade</h3>
            <div className="space-y-2">
              {POPULAR_STOCKS.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    setSelectedStock(stock)
                    setShowStocks(false)
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{stock.symbol}</div>
                      <div className="text-xs text-gray-600 truncate">{stock.name}</div>
                    </div>
                    <div className="text-sm font-medium">₹{stock.price}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                Click any stock to trade instantly
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Trading Modal */}
      {selectedStock && (
        <SimpleTradingModal
          isOpen={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          symbol={selectedStock.symbol}
          name={selectedStock.name}
          currentPrice={selectedStock.price}
        />
      )}

      {/* Backdrop to close floating menu */}
      {showStocks && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowStocks(false)}
        />
      )}
    </>
  )
}