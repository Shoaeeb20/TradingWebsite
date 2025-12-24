import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Stock from '@/models/Stock'
import User from '@/models/User'
import Order from '@/models/Order'
import Trade from '@/models/Trade'
import DataCleanupPanel from '@/components/admin/DataCleanupPanel'
import { ADMIN_EMAILS } from '@/lib/adminConfig'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect('/')
  }

  await connectDB()

  const stats = {
    totalUsers: await User.countDocuments(),
    totalStocks: await Stock.countDocuments(),
    totalOrders: await Order.countDocuments(),
    totalTrades: await Trade.countDocuments(),
    pendingOrders: await Order.countDocuments({ status: 'PENDING' }),
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Total Stocks</div>
          <div className="text-2xl font-bold">{stats.totalStocks}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Total Trades</div>
          <div className="text-2xl font-bold">{stats.totalTrades}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Pending Orders</div>
          <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <div className="space-y-2">
            <button className="btn btn-primary w-full">Sync Stocks from CSV</button>
            <button className="btn btn-secondary w-full">Match Pending Limit Orders</button>
            <button className="btn btn-secondary w-full">Clear Old Price Cache</button>
          </div>
        </div>

        <DataCleanupPanel />
      </div>
    </div>
  )
}
