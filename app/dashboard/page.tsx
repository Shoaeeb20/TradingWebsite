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

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  await connectDB()

  const user = await User.findOne({ email: session.user.email }).lean()
  const holdings = await Holding.find({ userId: user?._id }).lean()
  const recentTrades = await Trade.find({ userId: user?._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()
  const activeOrders = await Order.find({ userId: user?._id, status: 'PENDING' })
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <PortfolioSummary
        balance={user?.balance || 0}
        holdings={holdings.map((h) => ({
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
        }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ActiveOrders
          orders={activeOrders.map((o) => ({
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
        />
      </div>
    </div>
  )
}
