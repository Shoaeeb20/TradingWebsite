import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Holding from '@/models/Holding'
import LeaderboardTable from '@/components/LeaderboardTable'

export const dynamic = 'force-dynamic'

export default async function Leaderboard() {
  await connectDB()

  const users = await (User as any).find().select('name email balance').lean()
  const allHoldings = await (Holding as any).find().lean()

  const leaderboard = users.map((user) => {
    const userHoldings = allHoldings.filter((h) => h.userId.toString() === user._id.toString())
    const holdingsValue = userHoldings.reduce((sum, h) => sum + h.quantity * h.avgPrice, 0)
    const totalValue = user.balance + holdingsValue

    return {
      name: user.name,
      email: user.email,
      balance: user.balance,
      holdingsValue,
      totalValue,
    }
  })

  leaderboard.sort((a, b) => b.totalValue - a.totalValue)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      <LeaderboardTable users={leaderboard} />
    </div>
  )
}
