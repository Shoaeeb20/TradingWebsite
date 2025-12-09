import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center animate-fadeIn">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            🇮🇳 Practice Trading with Zero Risk
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Indian Stock Market</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start with ₹1,00,000 virtual cash. Trade <span className="font-bold text-blue-600">100 carefully selected NSE stocks</span> with real market data. Learn, practice, and compete—all for free.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signin" className="btn btn-primary text-lg px-8 py-4">
              Start Trading Free →
            </Link>
            <Link href="/market" className="btn btn-secondary text-lg px-8 py-4">
              Explore Markets
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Takes 30 seconds</p>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center hover:scale-105 animate-fadeIn">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto shadow-lg">
              📊
            </div>
            <h3 className="text-xl font-bold mb-3">100 Real NSE Stocks</h3>
            <p className="text-gray-600">Carefully selected top companies from Banking, IT, FMCG, Pharma, and more sectors.</p>
          </div>
          <div className="card text-center hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto shadow-lg">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Execution</h3>
            <p className="text-gray-600">Market & limit orders. Intraday & delivery trading. Short selling support.</p>
          </div>
          <div className="card text-center hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto shadow-lg">
              🏆
            </div>
            <h3 className="text-xl font-bold mb-3">Compete & Learn</h3>
            <p className="text-gray-600">Leaderboard rankings. Track P&L. Learn from your trades.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">Get started in 3 simple steps</p>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Sign Up Free</h3>
              <p className="text-gray-600">Create your account in 30 seconds. Get ₹1,00,000 virtual cash instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Browse & Trade</h3>
              <p className="text-gray-600">Explore 100+ NSE stocks. View charts, place orders, manage your portfolio.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Track & Improve</h3>
              <p className="text-gray-600">Monitor your P&L, analyze trades, climb the leaderboard, and master trading.</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 shadow-xl">
          <h2 className="text-4xl font-bold text-center mb-16">Everything You Need to Learn Trading</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-1">100 Top NSE Stocks</h4>
                <p className="text-gray-600 text-sm">Handpicked stocks including RELIANCE, TCS, HDFC, INFY, and 96 more blue-chip companies</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-1">Advanced Charts</h4>
                <p className="text-gray-600 text-sm">Price charts with volume, MA20, MA50 indicators</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-1">Intraday & Delivery</h4>
                <p className="text-gray-600 text-sm">Practice both trading styles with auto square-off at 3:20 PM</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-1">Short Selling</h4>
                <p className="text-gray-600 text-sm">Learn to profit from falling stocks with intraday shorts</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-1">Portfolio Tracking</h4>
                <p className="text-gray-600 text-sm">Real-time P&L, holdings, trade history, and performance analytics</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-1">Market Hours</h4>
                <p className="text-gray-600 text-sm">Realistic NSE trading hours (9:15 AM - 3:30 PM IST)</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of traders learning risk-free</p>
          <Link href="/auth/signin" className="btn btn-primary text-lg px-12 py-4 inline-block">
            Get Started Free →
          </Link>
          <p className="text-sm text-gray-500 mt-4">100% free • No hidden charges • Cancel anytime</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p>© 2024 PaperTrade India. For educational purposes only. Not real money trading.</p>
          <p className="mt-2">Developed by <a href="mailto:osman.shoaeeb@gmail.com" className="text-blue-600 hover:underline font-medium">osman.shoaeeb@gmail.com</a></p>
        </div>
      </div>
    </div>
  )
}
