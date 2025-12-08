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
}

export default function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Recent Trades</h2>

      {trades.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No trades yet</p>
      ) : (
        <div className="space-y-2">
          {trades.map((trade, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
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
      )}
    </div>
  )
}
