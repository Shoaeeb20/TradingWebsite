import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help & Tutorials - PaperTrade India',
  description: 'Complete guide to using PaperTrade India - Learn how to trade, manage portfolio, and master the platform',
}

export default function Help() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Help & Tutorials</h1>
      <p className="text-xl text-gray-600 mb-12">
        Complete guide to mastering PaperTrade India. Learn everything from basic trading to advanced strategies.
      </p>

      {/* Getting Started */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">🚀 Getting Started</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">1. Create Your Account</h3>
            <p className="text-gray-600 mb-4">
              Sign up with your email or Google account. You'll instantly receive ₹1,00,000 virtual cash to start trading.
            </p>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              <li>Click "Sign Up" on the homepage</li>
              <li>Enter your email and create a password</li>
              <li>Verify your email address</li>
              <li>Start trading immediately</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">2. Explore the Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Your dashboard shows your portfolio overview, recent trades, and market highlights.
            </p>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              <li>View your current balance and P&L</li>
              <li>Check your active positions</li>
              <li>See recent market movements</li>
              <li>Access quick trading options</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trading Guide */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">📊 Trading Guide</h2>
        
        <div className="bg-blue-50 p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">Understanding Order Types</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">Market Orders</h4>
              <p className="text-gray-700 mb-2">Execute immediately at current market price</p>
              <ul className="list-disc pl-6 text-sm text-gray-600">
                <li>Instant execution during market hours</li>
                <li>Price may vary slightly from displayed price</li>
                <li>Best for quick entry/exit</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Limit Orders</h4>
              <p className="text-gray-700 mb-2">Execute only at your specified price or better</p>
              <ul className="list-disc pl-6 text-sm text-gray-600">
                <li>Set your desired buy/sell price</li>
                <li>Order executes when market reaches your price</li>
                <li>May not execute if price doesn't reach your limit</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">Product Types Explained</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">Intraday Trading</h4>
              <p className="text-gray-700 mb-2">Buy and sell on the same day</p>
              <ul className="list-disc pl-6 text-sm text-gray-600">
                <li>Positions auto-close at 3:20 PM</li>
                <li>Short selling allowed</li>
                <li>Higher leverage potential</li>
                <li>No overnight risk</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Delivery Trading</h4>
              <p className="text-gray-700 mb-2">Hold positions for multiple days</p>
              <ul className="list-disc pl-6 text-sm text-gray-600">
                <li>Keep stocks in your portfolio</li>
                <li>No auto square-off</li>
                <li>Cannot short sell</li>
                <li>Long-term investment simulation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Trading */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">📈 How to Place Your First Trade</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">1</div>
              <h3 className="font-bold mb-2">Find a Stock</h3>
              <p className="text-gray-600 text-sm">Go to Market page and browse 100+ NSE stocks. Use search or filter by sectors.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">2</div>
              <h3 className="font-bold mb-2">Analyze & Decide</h3>
              <p className="text-gray-600 text-sm">View price charts, check company info, and decide whether to buy or sell.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">3</div>
              <h3 className="font-bold mb-2">Place Order</h3>
              <p className="text-gray-600 text-sm">Click Buy/Sell, choose order type, enter quantity, and confirm your trade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Management */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">💼 Portfolio Management</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Tracking Your Holdings</h3>
            <p className="text-gray-600 mb-4">Monitor your investments and performance:</p>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-2">
              <li><strong>Current Value:</strong> Real-time portfolio worth</li>
              <li><strong>P&L:</strong> Profit/Loss on each position</li>
              <li><strong>Day Change:</strong> Today's gains/losses</li>
              <li><strong>Holdings:</strong> All your current positions</li>
              <li><strong>Available Cash:</strong> Money available for trading</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Trade History</h3>
            <p className="text-gray-600 mb-4">Review all your past transactions:</p>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-2">
              <li><strong>All Trades:</strong> Complete transaction history</li>
              <li><strong>Order Status:</strong> Filled, pending, or cancelled</li>
              <li><strong>Performance Analysis:</strong> Win/loss ratios</li>
              <li><strong>Sector Exposure:</strong> Diversification tracking</li>
              <li><strong>Export Data:</strong> Download for analysis</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">🎯 Advanced Features</h2>
        
        <div className="bg-purple-50 p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">Short Selling (Intraday Only)</h3>
          <p className="text-gray-700 mb-4">
            Profit from falling stock prices by selling first and buying later.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">How it Works:</h4>
              <ol className="list-decimal pl-6 text-sm text-gray-600 space-y-1">
                <li>Select "SELL" without owning the stock</li>
                <li>Stock is sold at current market price</li>
                <li>Later, buy back at (hopefully) lower price</li>
                <li>Profit = Sell Price - Buy Price</li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold mb-2">Example:</h4>
              <div className="text-sm text-gray-600">
                <p>• Sell RELIANCE at ₹2500 (without owning)</p>
                <p>• Price drops to ₹2400</p>
                <p>• Buy back at ₹2400</p>
                <p>• Profit: ₹100 per share</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Auto Square-Off</h3>
          <p className="text-gray-700 mb-4">
            All intraday positions are automatically closed at 3:20 PM IST to simulate real market conditions.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-bold">Timing</h4>
              <p className="text-sm text-gray-600">3:20 PM IST daily</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-bold">Purpose</h4>
              <p className="text-sm text-gray-600">Simulate real trading</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-bold">Settlement</h4>
              <p className="text-sm text-gray-600">At market price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips and Strategies */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">💡 Trading Tips & Strategies</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">For Beginners</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Start with small quantities to learn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Focus on large-cap stocks initially</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Use limit orders to control prices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Keep a trading journal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Learn from your mistakes</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Risk Management</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">→</span>
                <span>Never risk more than 2% per trade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">→</span>
                <span>Diversify across different sectors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">→</span>
                <span>Set stop-losses for protection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">→</span>
                <span>Don't chase losing trades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">→</span>
                <span>Take profits when targets are met</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">🔧 Troubleshooting</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">Order Not Executing?</h3>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              <li>Check if market is open (9:15 AM - 3:30 PM IST)</li>
              <li>Verify you have sufficient balance</li>
              <li>For limit orders, check if your price is realistic</li>
              <li>Ensure you're not trying to short-sell in delivery mode</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">Portfolio Not Updating?</h3>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              <li>Refresh the page to get latest prices</li>
              <li>Check your internet connection</li>
              <li>Market data may have slight delays</li>
              <li>Contact support if issues persist</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for? Our support team is here to help!
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </Link>
          <Link href="/about" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  )
}