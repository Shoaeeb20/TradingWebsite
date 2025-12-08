import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'
import PortfolioTable from '@/components/PortfolioTable'

export const dynamic = 'force-dynamic'

export default async function Portfolio() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  await connectDB()
  const user = await User.findOne({ email: session.user.email }).lean()
  const holdings = await Holding.find({ userId: user?._id }).lean()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Portfolio</h1>

      <div className="card mb-6">
        <div className="text-sm text-gray-600">Available Balance</div>
        <div className="text-3xl font-bold text-primary">
          ₹{user?.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
      </div>

      <PortfolioTable
        holdings={holdings.map((h) => ({
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
        }))}
      />
    </div>
  )
}
