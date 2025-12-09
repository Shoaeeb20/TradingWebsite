import { connectDB } from '@/lib/db'
import Stock from '@/models/Stock'
import { notFound } from 'next/navigation'
import TradeForm from '@/components/TradeForm'
import StockChart from '@/components/StockChart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/User'
import Holding from '@/models/Holding'

export const dynamic = 'force-dynamic'

export default async function StockPage({ params }: { params: { symbol: string } }) {
  await connectDB()
  const stock = await Stock.findOne({ symbol: params.symbol.toUpperCase() }).lean()

  if (!stock) notFound()

  const session = await getServerSession(authOptions)
  
  let holdings: any[] = []
  if (session?.user) {
    const user = await User.findOne({ email: session.user.email }).lean()
    if (user) {
      holdings = await Holding.find({ userId: user._id, symbol: stock.symbol }).lean()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">{stock.symbol}</h1>
        <p className="text-gray-600">{stock.name}</p>
        {stock.sector && <p className="text-sm text-gray-500">{stock.sector}</p>}
        
        {holdings.length > 0 && (
          <div className="mt-3 flex gap-3">
            {holdings.map((h) => (
              <div key={h.productType} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  You own {h.quantity} shares ({h.productType})
                </span>
                <span className="text-xs text-blue-600">
                  Avg: ₹{h.avgPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockChart symbol={stock.symbol} />
        </div>

        <div>
          {session ? (
            <TradeForm symbol={stock.symbol} />
          ) : (
            <div className="card text-center">
              <p className="mb-4">Sign in to trade</p>
              <a href="/auth/signin" className="btn btn-primary">
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
