import { connectDB } from '@/lib/db'
import Stock from '@/models/Stock'
import { notFound } from 'next/navigation'
import TradeForm from '@/components/TradeForm'
import StockChart from '@/components/StockChart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function StockPage({ params }: { params: { symbol: string } }) {
  await connectDB()
  const stock = await Stock.findOne({ symbol: params.symbol.toUpperCase() }).lean()

  if (!stock) notFound()

  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">{stock.symbol}</h1>
        <p className="text-gray-600">{stock.name}</p>
        {stock.sector && <p className="text-sm text-gray-500">{stock.sector}</p>}
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
