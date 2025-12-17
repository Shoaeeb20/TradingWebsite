'use client'

import { useState, useEffect } from 'react'

interface OptionData {
  strike: number
  ce: { price: number }
  pe: { price: number }
}

interface OptionChainProps {
  index: 'NIFTY' | 'BANKNIFTY'
  onTrade: (index: string, strike: number, optionType: 'CE' | 'PE') => void
  refreshTrigger: number
}

export default function OptionChain({ index, onTrade, refreshTrigger }: OptionChainProps) {
  const [data, setData] = useState<{
    spotPrice: number
    atm: number
    optionChain: OptionData[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOptionChain()
  }, [index, refreshTrigger])

  const fetchOptionChain = async () => {
    try {
      const response = await fetch(`/api/fno/positions?action=quotes&index=${index}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch option chain:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return <div>Failed to load option chain</div>

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{index} Option Chain</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Spot Price</div>
            <div className="text-xl font-bold text-blue-600">₹{data.spotPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CE Price</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Strike</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">PE Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.optionChain.map((option) => (
              <tr key={option.strike} className={option.strike === data.atm ? 'bg-yellow-50' : ''}>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onTrade(index, option.strike, 'CE')}
                    className="w-full text-left hover:bg-green-50 p-2 rounded transition-colors"
                  >
                    <div className="font-medium text-green-600">₹{option.ce.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">CE</div>
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className={`font-medium ${option.strike === data.atm ? 'text-yellow-600 font-bold' : 'text-gray-900'}`}>
                    {option.strike}
                  </div>
                  {option.strike === data.atm && (
                    <div className="text-xs text-yellow-600">ATM</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onTrade(index, option.strike, 'PE')}
                    className="w-full text-right hover:bg-red-50 p-2 rounded transition-colors"
                  >
                    <div className="font-medium text-red-600">₹{option.pe.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">PE</div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}