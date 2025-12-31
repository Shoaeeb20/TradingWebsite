import type { Metadata } from 'next'
import LeaderboardClient from '@/components/LeaderboardClient'

export const metadata: Metadata = {
  title: 'Leaderboard - PaperTrade India',
  description: 'See top performing traders on PaperTrade India. Compare your performance with the best virtual traders and learn from their strategies.',
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the top performing traders on PaperTrade India. Learn from the best and climb the ranks!
          </p>
        </div>

        {/* Leaderboard Component */}
        <LeaderboardClient />

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Climb the Ranks?</h2>
          <p className="text-xl mb-6 opacity-90">
            Start trading today and see your name on the leaderboard!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/market" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Start Trading
            </a>
            <a 
              href="/community" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}