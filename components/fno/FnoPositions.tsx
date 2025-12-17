'use client'

import { useState, useEffect } from 'react'

interface FnoPosition {
  _id: string
  contract: {
    index: 'NIFTY' | 'BANKNIFTY'
    strike: number
    optionType: 'CE' | 'PE'
    expiry: string
  }
  quantity: number
  avgPrice: number
  currentPrice: number
  pnl: number
}

interface FnoPositionsProps {
  refreshTrigger: number
}

export default function FnoPositions({ refreshTrigger }: FnoPositionsProps) {
  const [positions, setPositions] = useState<FnoPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [closingPosition, setClosingPosition] = useState<string | null>(null)

  useEffect(() => {
    fetchPositions()
  }, [refreshTrigger])

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/fno/positions')
      const result = await response.json()
      setPositions(result.positions || [])
    } catch (error) {
      console.error('Failed to fetch positions:', error)
    } finally {
      setLoading(false)
    }
  }

  const closePosition = async (positionId: string) => {
    setClosingPosition(positionId)
    try {
      const response = await fetch('/api/fno/close-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionId })
      })

      if (response.ok) {
        fetchPositions() // Refresh positions
      }
    } catch (error) {
      console.error('Failed to close position:', error)
    } finally {
      setClosingPosition(null)
    }
  }

  const formatExpiry = (expiry: string) => {
    return new Date(expiry).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
  }

  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">F&O Positions ({positions.length})</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total P&L</div>
            <div className={`text-xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{totalPnl.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <div>No F&O positions found</div>
          <div className="text-sm">Start trading options to see your positions here</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">LTP</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">P&L</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {positions.map((position) => (
                <tr key={position._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {position.contract.index} {position.contract.strike} {position.contract.optionType}
                    </div>
                    <div className="text-sm text-gray-500">
                      Exp: {formatExpiry(position.contract.expiry)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      position.quantity > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {position.quantity > 0 ? 'LONG' : 'SHORT'} {Math.abs(position.quantity)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    ₹{position.avgPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    ₹{position.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{position.pnl.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => closePosition(position._id)}
                      disabled={closingPosition === position._id}
                      className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50"
                    >
                      {closingPosition === position._id ? 'Closing...' : 'Close'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}