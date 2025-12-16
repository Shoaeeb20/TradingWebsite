import LeaderboardTable from '@/components/LeaderboardTable'

export const dynamic = 'force-dynamic'

export default function Leaderboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      <LeaderboardTable />
    </div>
  )
}
