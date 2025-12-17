'use client'

import { useState, useEffect } from 'react'

interface FnoTradeFormProps {
  index?: string
  strike?: number
  optionType?: 'CE' | 'PE'
  onTradeComplete: () => void
}

export default function FnoTradeForm({ index, strike, optionType, onTradeComplete }: FnoTradeFormProps) {
  const [formData, setFormData] = useState({
    index: 'NIFTY',
    strike: '',
    optionType: 'CE',
    action: 'BUY',
    quantity: '50'
  })

  // Update form when props change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      index: index || prev.index,
      strike: strike ? strike.toString() : prev.strike,
      optionType: optionType || prev.optionType
    }))
  }, [index, strike, optionType])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/fno/place-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: formData.index,
          strike: Number(formData.strike),
          optionType: formData.optionType,
          action: formData.action,
          quantity: Number(formData.quantity)
        })
      })

      const result = await response.json()

      if (response.ok) {
        onTradeComplete()
        // Reset form if not pre-filled
        if (!index && !strike && !optionType) {
          setFormData(prev => ({ ...prev, strike: '', quantity: '50' }))
        }
      } else {
        setError(result.error || 'Trade failed')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const strikeInterval = formData.index === 'NIFTY' ? 50 : 100

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Place F&O Trade</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Index</label>
            <select
              value={formData.index}
              onChange={(e) => setFormData(prev => ({ ...prev, index: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!index}
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strike (Multiple of {strikeInterval})
            </label>
            <input
              type="number"
              step={strikeInterval}
              value={formData.strike}
              onChange={(e) => setFormData(prev => ({ ...prev, strike: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`e.g. ${formData.index === 'NIFTY' ? '19500' : '44000'}`}
              required
              disabled={!!strike}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Option Type</label>
            <select
              value={formData.optionType}
              onChange={(e) => setFormData(prev => ({ ...prev, optionType: e.target.value as 'CE' | 'PE' }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!optionType}
            >
              <option value="CE">Call (CE)</option>
              <option value="PE">Put (PE)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={formData.action}
              onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Lots)</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            formData.action === 'BUY'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Placing Trade...' : `${formData.action} ${formData.optionType}`}
        </button>
      </form>
    </div>
  )
}