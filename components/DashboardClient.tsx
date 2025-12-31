'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import FirstTradeWizard from './FirstTradeWizard'
import PortfolioSummary from './PortfolioSummary'
import RecentTrades from './RecentTrades'
import ActiveOrders from './ActiveOrders'
import GrowwReferral from './GrowwReferral'
import FreeTierBanner from './FreeTierBanner'
import Link from 'next/link'

interface DashboardData {
  user: any
  holdings: any[]
  recentTrades: any[]
  totalTrades: number
  activeOrders: any[]
}

interface UserProgress {
  hasFirstTrade: boolean
  totalTrades: number
  totalProfit: number
  joinedDate: string
  daysSinceJoined: number
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const { data: session } = useSession()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [showWizard, setShowWizard] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProgress()
  }, [])

  const fetchUserProgress = async () => {
    try {
      const response = await fetch('/api/user/progress')
      const data = await response.json()
      
      if (data.success) {
        setUserProgress(data.data)
        setShowWizard(!data.data.hasFirstTrade)
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTradeComplete = async () => {
    // Award first trade bonus
    try {
      await fetch('/api/user/progress', { method: 'POST' })
    } catch (error) {
      console.error('Error awarding bonus:', error)
    }

    // Hide wizard and refresh data
    setShowWizard(false)
    fetchUserProgress()
    
    // Refresh the page to show updated data
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Free Tier Usage Notice */}
      <FreeTierBanner />
      
      {/* First Trade Wizard - Show only for new users */}
      {showWizard && (
        <FirstTradeWizard onTradeComplete={handleTradeComplete} />
      )}
      
      {/* Educational Market Studies Banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📚</div>
            <div>
              <h3 className="font-semibold text-blue-900">Enhance Your Trading Knowledge</h3>
              <p className="text-sm text-blue-700">Access educational market studies and analysis for just ₹39/month</p>
            </div>
          </div>
          <Link 
            href="/trade-ideas/subscribe" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Learn More →
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <PortfolioSummary
        balance={initialData.user.balance || 0}
        fnoBalance={initialData.user.fnoBalance || 0}
        holdings={initialData.holdings.map((h) => ({
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
        }))}
      />

      {/* Groww Referral */}
      <div className="mt-8">
        <GrowwReferral />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ActiveOrders
          orders={initialData.activeOrders.map((o: any) => ({
            id: o._id.toString(),
            symbol: o.symbol,
            type: o.type,
            orderType: o.orderType,
            quantity: o.quantity,
            price: o.price,
            status: o.status,
            createdAt: o.createdAt,
          }))}
        />

        <RecentTrades
          trades={initialData.recentTrades.map((t: any) => ({
            id: t._id.toString(),
            symbol: t.symbol,
            type: t.type,
            quantity: t.quantity,
            price: t.price,
            pnl: t.pnl,
            total: t.total || (t.quantity * t.price),
            createdAt: t.createdAt,
          }))}
          totalTrades={initialData.totalTrades}
        />
      </div>

      {/* User Progress Stats (if they've made trades) */}
      {userProgress && userProgress.hasFirstTrade && (
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">🎯 Your Trading Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{userProgress.totalTrades}</div>
              <div className="text-sm text-green-600">Total Trades</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${userProgress.totalProfit >= 0 ? 'text-green-800' : 'text-red-600'}`}>
                ₹{userProgress.totalProfit.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Total P&L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{userProgress.daysSinceJoined}</div>
              <div className="text-sm text-green-600">Days Trading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                {userProgress.totalTrades > 0 ? Math.round((userProgress.totalTrades / Math.max(userProgress.daysSinceJoined, 1)) * 10) / 10 : 0}
              </div>
              <div className="text-sm text-green-600">Trades/Day</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}