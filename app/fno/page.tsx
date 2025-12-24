'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import OptionChain from '../../components/fno/OptionChain'
import FnoTradeForm from '../../components/fno/FnoTradeForm'
import FnoPositions from '../../components/fno/FnoPositions'

export default function FnoPage() {
  const { data: session, status } = useSession()
  const [selectedIndex, setSelectedIndex] = useState<'NIFTY' | 'BANKNIFTY'>('NIFTY')
  const [tradeFormData, setTradeFormData] = useState<{
    index?: string
    strike?: number
    optionType?: 'CE' | 'PE'
  }>({})
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Auto-refresh both components every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 120000) // 2 minutes
    return () => clearInterval(interval)
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  const handleTradeClick = (index: string, strike: number, optionType: 'CE' | 'PE') => {
    setTradeFormData({ index, strike, optionType })
  }

  const handleIndexChange = (newIndex: 'NIFTY' | 'BANKNIFTY') => {
    setSelectedIndex(newIndex)
    // Clear trade form data when switching indices
    setTradeFormData({ index: newIndex })
  }

  const handleTradeComplete = () => {
    setRefreshTrigger(prev => prev + 1)
    setTradeFormData({}) // Clear form data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Educational Market Studies Banner */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-orange-900">Master F&O Trading</h3>
                <p className="text-sm text-orange-700">Learn advanced options strategies and futures trading - Educational content for ₹39/month</p>
              </div>
            </div>
            <Link 
              href="/trade-ideas/subscribe" 
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Subscribe →
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">F&O Trading</h1>
          <p className="text-gray-600 mt-2">
            Trade NIFTY and BANKNIFTY options with paper money
          </p>
        </div>

        {/* Index Selector */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => handleIndexChange('NIFTY')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedIndex === 'NIFTY'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              NIFTY
            </button>
            <button
              onClick={() => handleIndexChange('BANKNIFTY')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedIndex === 'BANKNIFTY'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              BANKNIFTY
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Option Chain - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <OptionChain 
              index={selectedIndex} 
              onTrade={handleTradeClick}
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Trade Form - Takes 1 column */}
          <div>
            <FnoTradeForm
              index={tradeFormData.index}
              strike={tradeFormData.strike}
              optionType={tradeFormData.optionType}
              onTradeComplete={handleTradeComplete}
            />
          </div>
        </div>

        {/* Positions */}
        <div className="mt-8">
          <FnoPositions refreshTrigger={refreshTrigger} />
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Paper Trading Disclaimer
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This is a paper trading simulator for educational purposes only. 
                  No real money is involved. Options expire every Thursday at 3:30 PM IST.
                  Pricing is simplified and may not reflect actual market conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}