'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface Trade {
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  total: number
  createdAt: string
}

interface RecentTradesProps {
  trades: Trade[]
  totalTrades?: number
}

export default function RecentTrades({ trades, totalTrades }: RecentTradesProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const tradesPerPage = 5
  const totalPages = Math.ceil(trades.length / tradesPerPage)
  
  const startIndex = (currentPage - 1) * tradesPerPage
  const endIndex = startIndex + tradesPerPage
  const currentTrades = trades.slice(startIndex, endIndex)
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Trades</h2>
        {totalTrades && (
          <span className="text-sm text-gray-600">{totalTrades} total</span>
        )}
      </div>

      {trades.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No trades yet</p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {currentTrades.map((trade, idx) => (
              <div key={startIndex + idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-semibold">{trade.symbol}</div>
                  <div className="text-sm text-gray-600">
                    {trade.quantity} @ ₹{trade.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${trade.type === 'BUY' ? 'text-success' : 'text-danger'}`}>
                    {trade.type}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
