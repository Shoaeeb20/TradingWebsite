import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'
import PortfolioTable from '@/components/PortfolioTable'
import SquareOffButton from '@/components/SquareOffButton'
import GrowwReferral from '@/components/GrowwReferral'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Portfolio() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  await connectDB()
  const user = await (User as any).findOne({ email: session.user.email }).lean()
  if (!user) redirect('/auth/signin')

  const holdings = await (Holding as any).find({ userId: user._id }).lean()
  const userId = user._id.toString()
  const hasIntradayPositions = holdings.some((h: any) => h.productType === 'INTRADAY')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Educational Market Studies Banner */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💼</div>
            <div>
              <h3 className="font-semibold text-purple-900">Optimize Your Portfolio</h3>
              <p className="text-sm text-purple-700">Learn advanced portfolio management strategies - Educational content for ₹39/month</p>
            </div>
          </div>
          <Link 
            href="/trade-ideas/subscribe" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Learn More →
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Portfolio</h1>

      <div className="card mb-6">
        <div className="text-sm text-gray-600">Available Balance</div>
        <div className="text-3xl font-bold text-primary">
          ₹{user.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Groww Referral */}
      <GrowwReferral />

      {/* Square-off Section */}
      {hasIntradayPositions && (
        <div className="card mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Intraday Square-off</h3>
              <p className="text-sm text-yellow-700 mb-3">
                ⚠️ <strong>Disclaimer:</strong> Automatic intraday square-off at 3:20 PM may not work reliably on the free tier. 
                Please use the manual square-off button below to close your intraday positions before market close.
              </p>
              <p className="text-xs text-yellow-600">
                Note: This will only square-off INTRADAY positions. Your DELIVERY holdings will remain unchanged.
              </p>
            </div>
            <SquareOffButton />
          </div>
        </div>
      )}

      <PortfolioTable
        holdings={holdings.map((h) => ({
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          productType: h.productType,
        }))}
        userId={userId}
      />
    </div>
  )
}
