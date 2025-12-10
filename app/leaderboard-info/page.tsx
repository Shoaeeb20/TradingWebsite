import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Your Virtual Stock Trading Performance | PaperTrade India',
  description:
    'Compete with other traders on our leaderboard. Track portfolio performance, compare returns, and improve your virtual stock trading skills with detailed analytics.',
  keywords:
    'leaderboard, virtual stock trading, practice trading India, trading performance, portfolio tracking, learn stock market',
}

export default function LeaderboardInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Track Your Virtual Stock Trading Performance
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Compete with fellow traders, track your progress, and climb the leaderboard. See how
            your virtual stock trading skills stack up against others in our community.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Join the Competition!
          </Link>
        </div>

        {/* Leaderboard Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Competitive Trading Leaderboard</h2>
          <p className="text-gray-600 mb-6">
            Our leaderboard ranks traders based on portfolio performance, encouraging healthy
            competition and continuous learning. Track your progress and see how your practice
            trading India skills improve over time.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ranking Metrics</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-purple-500 mr-3">🏆</span>
                  Total portfolio value ranking
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-3">📈</span>
                  Percentage returns comparison
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-3">💰</span>
                  Profit & loss leaderboard
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-3">⭐</span>
                  Trading consistency scores
                </li>
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Fair Competition</h4>
              <p className="text-gray-700 text-sm">
                All traders start with the same ₹1,00,000 virtual balance, ensuring fair
                competition. Rankings are updated in real-time based on current portfolio values and
                trading performance.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Performance Analytics</h2>
          <p className="text-gray-600 mb-6">
            Beyond rankings, get comprehensive insights into your virtual stock trading performance.
            Analyze your strengths, identify areas for improvement, and learn stock market patterns
            through detailed analytics.
          </p>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">📊</span>
              Portfolio composition and sector allocation
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">📉</span>
              Win/loss ratio and trade success rate
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">⏱️</span>
              Average holding period analysis
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">🎯</span>
              Risk-adjusted returns calculation
            </li>
          </ul>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Learn from Data</h4>
            <p className="text-gray-700">
              Use performance analytics to understand your trading patterns. Identify which
              strategies work best for you and continuously improve your virtual stock trading
              approach.
            </p>
          </div>
        </div>

        {/* Community Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Learn from Top Performers</h3>
          <p className="text-gray-600 mb-6">
            Study the strategies of top-ranked traders on our leaderboard. See which stocks they're
            trading, their portfolio allocation, and learn from their successful virtual stock
            trading approaches.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🥇</div>
              <div className="font-semibold text-gray-900">Top Trader</div>
              <div className="text-sm text-gray-600">Highest portfolio value</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-semibold text-gray-900">Best Returns</div>
              <div className="text-sm text-gray-600">Highest percentage gain</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold text-gray-900">Most Consistent</div>
              <div className="text-sm text-gray-600">Steady performance</div>
            </div>
          </div>
        </div>

        {/* Gamification Elements */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Gamified Learning Experience</h3>
          <p className="text-gray-600 mb-6">
            Our leaderboard makes learning stock market trading fun and engaging. Compete with
            friends, set personal goals, and celebrate milestones as you improve your practice
            trading India skills.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Achievement Badges</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>🏅 First Profitable Trade</li>
                <li>💎 Diamond Hands (Long-term holding)</li>
                <li>⚡ Day Trader (Multiple intraday trades)</li>
                <li>🎯 Precision Trader (High win rate)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Milestones</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>📈 10% Portfolio Growth</li>
                <li>🏆 Top 10 Leaderboard Entry</li>
                <li>💰 ₹10,000 Profit Milestone</li>
                <li>🌟 100 Successful Trades</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Learning */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Social Learning Community</h3>
          <p className="text-gray-600 mb-6">
            Connect with other traders, share strategies, and learn stock market techniques
            together. Our leaderboard fosters a supportive community where everyone can improve
            their virtual stock trading skills.
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Why Competition Helps Learning</h4>
            <p className="text-gray-700">
              Healthy competition motivates continuous improvement. By comparing your performance
              with others, you'll discover new strategies, avoid common mistakes, and accelerate
              your learning journey in the stock market.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Climb the Leaderboard?</h2>
          <p className="text-xl mb-6">
            Start your virtual trading journey and compete with India's most active paper traders
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors mr-4"
          >
            Join Competition
          </Link>
          <Link
            href="/leaderboard"
            className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}
