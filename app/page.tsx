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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          PaperTrade <span className="text-primary">India</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master the Indian stock market with virtual trading. Practice with ₹1,00,000 virtual
          cash, zero risk.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signin" className="btn btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link href="/market" className="btn btn-secondary text-lg px-8 py-3">
            Explore Markets
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="card">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-semibold mb-2">Real Market Data</h3>
            <p className="text-sm text-gray-600">Delayed quotes from NSE stocks</p>
          </div>
          <div className="card">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Instant Execution</h3>
            <p className="text-sm text-gray-600">Market & limit orders</p>
          </div>
          <div className="card">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold mb-2">Leaderboard</h3>
            <p className="text-sm text-gray-600">Compete with other traders</p>
          </div>
        </div>
      </div>
    </div>
  )
}
