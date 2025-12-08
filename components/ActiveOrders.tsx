'use client'

import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  orderType: 'MARKET' | 'LIMIT'
  quantity: number
  price?: number
  createdAt: string
}

interface ActiveOrdersProps {
  orders: Order[]
}

export default function ActiveOrders({ orders }: ActiveOrdersProps) {
  const [cancelling, setCancelling] = useState<string | null>(null)
  const router = useRouter()

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId)
    try {
      await fetch('/api/order/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      router.refresh()
    } catch (error) {
      console.error('Cancel failed:', error)
    }
    setCancelling(null)
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Active Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active orders</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-semibold">{order.symbol}</div>
                <div className="text-sm text-gray-600">
                  {order.orderType} {order.type} {order.quantity}
                  {order.price && ` @ ₹${order.price.toFixed(2)}`}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </div>
              </div>
              <button
                onClick={() => handleCancel(order.id)}
                disabled={cancelling === order.id}
                className="btn btn-danger text-sm"
              >
                {cancelling === order.id ? 'Cancelling...' : 'Cancel'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
