'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TradeFormProps {
  symbol: string
}

export default function TradeForm({ symbol }: TradeFormProps) {
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY')
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET')
  const [productType, setProductType] = useState<'INTRADAY' | 'DELIVERY'>('DELIVERY')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          type,
          orderType,
          productType,
          quantity: parseInt(quantity),
          price: orderType === 'LIMIT' ? parseFloat(price) : undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(`✓ ${data.message}`)
        setQuantity('')
        setPrice('')
        setTimeout(() => router.refresh(), 1000)
      } else {
        setMessage(`✗ ${data.error}`)
      }
    } catch (error) {
      setMessage('✗ Failed to place order')
    }

    setLoading(false)
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Place Order</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('BUY')}
            className={`flex-1 py-2 rounded-lg font-medium ${
              type === 'BUY' ? 'bg-success text-white' : 'bg-gray-100'
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setType('SELL')}
            className={`flex-1 py-2 rounded-lg font-medium ${
              type === 'SELL' ? 'bg-danger text-white' : 'bg-gray-100'
            }`}
          >
            SELL
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOrderType('MARKET')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              orderType === 'MARKET' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Market
          </button>
          <button
            type="button"
            onClick={() => setOrderType('LIMIT')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              orderType === 'LIMIT' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Limit
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setProductType('INTRADAY')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              productType === 'INTRADAY' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Intraday
          </button>
          <button
            type="button"
            onClick={() => setProductType('DELIVERY')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              productType === 'DELIVERY' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Delivery
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            min="1"
            required
          />
        </div>

        {orderType === 'LIMIT' && (
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Placing...' : `Place ${type} Order (${productType})`}
        </button>

        {message && (
          <div
            className={`text-sm p-2 rounded ${
              message.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
