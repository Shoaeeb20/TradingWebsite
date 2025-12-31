import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'
import Trade from '@/models/Trade'
import Order from '@/models/Order'
import DashboardClient from '@/components/DashboardClient'

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

  // Serialize data for client component
  const dashboardData = {
    user: JSON.parse(JSON.stringify(user)),
    holdings: JSON.parse(JSON.stringify(holdings)),
    recentTrades: JSON.parse(JSON.stringify(recentTrades)),
    totalTrades,
    activeOrders: JSON.parse(JSON.stringify(activeOrders))
  }

  return <DashboardClient initialData={dashboardData} />
}
