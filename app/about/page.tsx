import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - PaperTrade India',
  description: 'Learn about PaperTrade India - Free virtual stock trading platform for learning Indian stock market',
}

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About PaperTrade India</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            PaperTrade India is dedicated to democratizing stock market education in India. We believe that everyone should have access to learn trading and investing without risking their hard-earned money.
          </p>
          <p className="mb-4">
            Our platform provides a realistic trading simulation environment where beginners can practice, learn, and build confidence before entering the real stock market.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🎯 Risk-Free Learning</h3>
              <p className="text-gray-700">Practice trading with ₹1,00,000 virtual cash. Make mistakes and learn without losing real money.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📊 Real Market Data</h3>
              <p className="text-gray-700">Trade with actual NSE stock prices and experience realistic market conditions.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🏆 Competitive Learning</h3>
              <p className="text-gray-700">Compete with other traders on our leaderboard and track your progress.</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📈 Complete Trading Experience</h3>
              <p className="text-gray-700">Intraday, delivery, short selling, portfolio tracking, and P&L analysis.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose PaperTrade India?</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>100% Free:</strong> No hidden charges, no premium plans, completely free to use</li>
            <li><strong>Indian Market Focus:</strong> Specifically designed for NSE stocks and Indian trading hours</li>
            <li><strong>Beginner Friendly:</strong> Easy-to-use interface perfect for newcomers</li>
            <li><strong>Educational:</strong> Learn by doing with realistic trading scenarios</li>
            <li><strong>Safe Environment:</strong> Practice without financial risk</li>
            <li><strong>Real-time Data:</strong> Experience actual market movements</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="mb-4">
            PaperTrade India was created to address the lack of accessible, India-focused trading education platforms. Many aspiring traders jump into the market without proper knowledge, leading to significant losses.
          </p>
          <p className="mb-4">
            We built this platform to bridge that gap - providing a safe space where anyone can learn trading fundamentals, test strategies, and build confidence before risking real money.
          </p>
          <p className="mb-4">
            Our carefully curated list of 100+ NSE stocks includes top companies from various sectors, giving users exposure to different market segments and trading opportunities.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Trading Features:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Market & Limit Orders</li>
                  <li>• Intraday & Delivery Trading</li>
                  <li>• Short Selling Support</li>
                  <li>• Auto Square-off</li>
                  <li>• Real NSE Trading Hours</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analysis Tools:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Portfolio Tracking</li>
                  <li>• P&L Analysis</li>
                  <li>• Trade History</li>
                  <li>• Performance Charts</li>
                  <li>• Leaderboard Rankings</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Important Disclaimers</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm">
              <strong>Educational Purpose Only:</strong> PaperTrade India is a simulation platform for educational purposes. It does not constitute financial advice or recommendations.
            </p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm">
              <strong>No Real Money:</strong> All trading on this platform is virtual. No real money is involved, and virtual profits cannot be withdrawn.
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm">
              <strong>Consult Professionals:</strong> Before making real investment decisions, please consult with qualified financial advisors.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
          <p className="mb-6">
            Ready to begin your trading journey? Join thousands of users who are learning to trade risk-free on PaperTrade India.
          </p>
          <div className="text-center">
            <Link href="/auth/signin" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
              Start Trading Free →
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <p className="mb-4">
            Email: <a href="mailto:osman.shoaeeb@gmail.com" className="text-blue-600 hover:underline">osman.shoaeeb@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}