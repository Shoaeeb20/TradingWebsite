'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function MarketInfoPage() {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free NSE Paper Trading Simulator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master the Indian stock market with our comprehensive virtual trading platform. Practice
            with real NSE data, zero risk, and ₹1,00,000 starting balance.
          </p>
          <Link
            href={session ? "/market" : "/auth/signin"}
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {session ? "Go to Market" : "Start Trading Now - It's Free!"}
          </Link>
        </div>

        {/* Real Market Data Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trade with Real NSE Market Data</h2>
          <p className="text-gray-600 mb-6">
            Experience authentic market conditions with delayed NSE stock prices from Yahoo Finance.
            Our free NSE paper trading simulator provides real-time market movements, helping you
            understand price fluctuations and market dynamics without financial risk.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              100+ NSE stocks including NIFTY 50 companies
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Real-time price updates every 2 minutes
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Accurate market open/close timings
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Historical price charts and trends
            </li>
          </ul>
        </div>

        {/* Virtual Trading Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Virtual Stock Trading Experience
          </h2>
          <p className="text-gray-600 mb-6">
            Our practice trading India platform offers all essential trading features. Execute
            market and limit orders, manage your portfolio, and track performance just like real
            trading - but with virtual money.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trading Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Market & Limit Orders
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Intraday & Delivery Trading
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Short Selling (Intraday)
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Auto Square-off at 3:20 PM
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Portfolio Management</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Real-time P&L tracking
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Holdings & positions view
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Trade history & analytics
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-3">•</span>
                  Performance leaderboard
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Learn Stock Market Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Learn Stock Market Trading Risk-Free
          </h3>
          <p className="text-gray-600 mb-6">
            Perfect for beginners and experienced traders alike. Practice different strategies,
            understand market behavior, and build confidence before investing real money. Our
            virtual stock trading platform is completely free with no hidden charges.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Why Choose PaperTrade India?</h4>
            <p className="text-gray-700">
              Unlike other simulators, we focus specifically on Indian markets with NSE-listed
              stocks. Practice intraday trading, delivery trading, and portfolio management with
              realistic market conditions and zero financial risk.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl mb-6">
            Join thousands of traders practicing on India's most realistic paper trading simulator
          </p>
          <Link
            href={session ? "/market" : "/auth/signin"}
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors mr-4"
          >
            {session ? "Go to Market" : "Create Free Account"}
          </Link>
          <Link
            href="/market"
            className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Explore Markets
          </Link>
        </div>
      </div>
    </div>
  )
}
