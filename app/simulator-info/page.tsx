'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function SimulatorInfoPage() {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Practice Intraday and Delivery Trading Risk-Free
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master both intraday and delivery trading strategies with our advanced virtual stock trading simulator. Experience real market conditions without risking your capital.
          </p>
          <Link 
            href={session ? "/market" : "/auth/signin"}
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {session ? "Go to Market" : "Start Practicing Today!"}
          </Link>
        </div>

        {/* Intraday Trading Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Master Intraday Trading Strategies
          </h2>
          <p className="text-gray-600 mb-6">
            Learn intraday trading with our realistic simulator that includes short selling, auto square-off, and real-time market movements. Practice day trading techniques and understand market volatility without financial risk.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Intraday Features</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Short selling for profit in falling markets
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Auto square-off at 3:20 PM IST
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Real-time P&L tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Market and limit order execution
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Why Practice Intraday?</h4>
              <p className="text-gray-700 text-sm">
                Intraday trading requires quick decision-making and risk management skills. Our simulator lets you practice these skills with virtual money, helping you understand market patterns and develop profitable strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Trading Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Build Long-term Delivery Portfolios
          </h2>
          <p className="text-gray-600 mb-6">
            Practice delivery trading to understand long-term investment strategies. Hold positions overnight, track portfolio performance, and learn how to build a diversified stock portfolio with our virtual stock trading platform.
          </p>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">•</span>
              Hold positions for days, weeks, or months
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">•</span>
              Portfolio diversification across sectors
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">•</span>
              Long-term P&L analysis and tracking
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-3">•</span>
              Dividend simulation (coming soon)
            </li>
          </ul>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Learn Investment Fundamentals</h4>
            <p className="text-gray-700">
              Delivery trading teaches patience and fundamental analysis. Practice buying quality stocks and holding them for the long term to understand how wealth creation works in the stock market.
            </p>
          </div>
        </div>

        {/* Trading Engine Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Advanced Trading Engine Features
          </h3>
          <p className="text-gray-600 mb-6">
            Our practice trading India platform uses a sophisticated trading engine that mimics real market conditions. Experience order matching, price discovery, and portfolio management just like professional trading platforms.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">₹1,00,000</div>
              <div className="text-sm text-gray-600">Starting Virtual Balance</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-sm text-gray-600">NSE Listed Stocks</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">Real-time</div>
              <div className="text-sm text-gray-600">Market Data Updates</div>
            </div>
          </div>
        </div>

        {/* Learning Benefits */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Learn Stock Market Without Risk
          </h3>
          <p className="text-gray-600 mb-6">
            Perfect for beginners who want to learn stock market basics and experienced traders testing new strategies. Our virtual stock trading environment provides a safe space to make mistakes and learn from them.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Beginners</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Understand order types and execution</li>
                <li>• Learn risk management techniques</li>
                <li>• Practice portfolio diversification</li>
                <li>• Get familiar with market terminology</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Experienced Traders</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Test new trading strategies</li>
                <li>• Practice with different position sizes</li>
                <li>• Experiment with sector rotation</li>
                <li>• Refine entry and exit timing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Trading Skills?</h2>
          <p className="text-xl mb-6">
            Start practicing intraday and delivery trading with India's most realistic simulator
          </p>
          <Link 
            href={session ? "/market" : "/auth/signin"}
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors mr-4"
          >
            {session ? "Go to Market" : "Create Free Account"}
          </Link>
          <Link 
            href="/dashboard"
            className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}