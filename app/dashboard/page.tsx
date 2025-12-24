import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'
import Trade from '@/models/Trade'
import Order from '@/models/Order'
import PortfolioSummary from '@/components/PortfolioSummary'
import RecentTrades from '@/components/RecentTrades'
import ActiveOrders from '@/components/ActiveOrders'
import GrowwReferral from '@/components/GrowwReferral'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  await connectDB()

  const user = await (User as any).findOne({ email: session.user.email }).lean()
  if (!user) redirect('/auth/signin')

  const holdings = await (Holding as any).find({ userId: user._id }).lean()
  const recentTrades = await (Trade as any).find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean()
  const totalTrades = await (Trade as any).countDocuments({ userId: user._id })
  const activeOrders = await (Order as any).find({ userId: user._id, status: 'PENDING' })
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Educational Market Studies Banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📚</div>
            <div>
              <h3 className="font-semibold text-blue-900">Enhance Your Trading Knowledge</h3>
              <p className="text-sm text-blue-700">Access educational market studies and analysis for just ₹39/month</p>
            </div>
          </div>
          <Link 
            href="/trade-ideas/subscribe" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Learn More →
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <PortfolioSummary
        balance={user.balance || 0}
        fnoBalance={user.fnoBalance || 0}
        holdings={holdings.map((h) => ({
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
        }))}
      />

      {/* Groww Referral */}
      <div className="mt-8">
        <GrowwReferral />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ActiveOrders
          orders={activeOrders.map((o: any) => ({
            id: o._id.toString(),
            symbol: o.symbol,
            type: o.type,
            orderType: o.orderType,
            quantity: o.quantity,
            price: o.price,
            createdAt: o.createdAt.toISOString(),
          }))}
        />

        <RecentTrades
          trades={recentTrades.map((t) => ({
            symbol: t.symbol,
            type: t.type,
            quantity: t.quantity,
            price: t.price,
            total: t.total,
            createdAt: t.createdAt.toISOString(),
          }))}
          totalTrades={totalTrades}
        />
      </div>
    </div>
  )
}
