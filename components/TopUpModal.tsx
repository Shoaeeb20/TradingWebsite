'use client'

import { useState } from 'react'

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  balanceType: 'EQUITY' | 'FNO'
  onSuccess: (newBalances: { balance: number; fnoBalance: number }) => void
}

export default function TopUpModal({ isOpen, onClose, balanceType, onSuccess }: TopUpModalProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000]

  const handleTopUp = async () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) return

    setLoading(true)
    try {
      const response = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numAmount, balanceType })
      })

      const data = await response.json()
      if (data.success) {
        onSuccess({ balance: data.balance, fnoBalance: data.fnoBalance })
        setAmount('')
        onClose()
      }
    } catch (error) {
      console.error('Top-up failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Add Money to {balanceType === 'EQUITY' ? 'Equity' : 'F&O'} Balance
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quick Select</label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleTopUp}
              disabled={!amount || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Money'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}