import type { Metadata } from 'next'
import Link from 'next/link'
import ContentAwareAd from '@/components/ads/ContentAwareAd'
import { getAdSlot } from '@/lib/adsense'

export const metadata: Metadata = {
  title: 'Trading Blog - PaperTrade India',
  description: 'Learn stock market trading, investment strategies, and market analysis with our comprehensive blog',
}

const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to Stock Market Trading for Beginners",
    excerpt: "Learn the fundamentals of stock trading, from understanding market basics to placing your first trade. Perfect for newcomers to the Indian stock market.",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Beginner Guide",
    slug: "complete-guide-stock-market-trading-beginners"
  },
  {
    id: 2,
    title: "Intraday vs Delivery Trading: Which is Right for You?",
    excerpt: "Understand the key differences between intraday and delivery trading, their pros and cons, and how to choose the right strategy for your goals.",
    date: "December 12, 2024",
    readTime: "6 min read",
    category: "Trading Strategy",
    slug: "intraday-vs-delivery-trading-comparison"
  },
  {
    id: 3,
    title: "Top 10 NSE Stocks Every Beginner Should Know",
    excerpt: "Discover the most beginner-friendly stocks on NSE, including blue-chip companies from banking, IT, and FMCG sectors.",
    date: "December 10, 2024",
    readTime: "5 min read",
    category: "Stock Analysis",
    slug: "top-10-nse-stocks-beginners"
  },
  {
    id: 4,
    title: "Understanding Market Orders vs Limit Orders",
    excerpt: "Master the two fundamental order types in stock trading. Learn when to use market orders and when limit orders are more appropriate.",
    date: "December 8, 2024",
    readTime: "4 min read",
    category: "Trading Basics",
    slug: "market-orders-vs-limit-orders-guide"
  },
  {
    id: 5,
    title: "Risk Management Strategies for New Traders",
    excerpt: "Essential risk management techniques to protect your capital. Learn about position sizing, stop losses, and portfolio diversification.",
    date: "December 5, 2024",
    readTime: "7 min read",
    category: "Risk Management",
    slug: "risk-management-strategies-new-traders"
  },
  {
    id: 6,
    title: "How to Read Stock Charts: A Beginner's Guide",
    excerpt: "Learn to interpret price charts, understand trends, and identify key support and resistance levels for better trading decisions.",
    date: "December 3, 2024",
    readTime: "9 min read",
    category: "Technical Analysis",
    slug: "how-to-read-stock-charts-beginners"
  }
]

const categories = ["All", "Beginner Guide", "Trading Strategy", "Stock Analysis", "Trading Basics", "Risk Management", "Technical Analysis"]

export default function Blog() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Trading Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master the Indian stock market with our comprehensive guides, tutorials, and market insights. 
          From beginner basics to advanced strategies.
        </p>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
          <div className="max-w-3xl">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Featured</span>
            <h2 className="text-3xl font-bold mt-4 mb-4">
              Complete Stock Market Trading Course for Indians
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              A comprehensive 10-part series covering everything from market basics to advanced trading strategies. 
              Specifically designed for the Indian stock market and NSE trading.
            </p>
            <div className="flex items-center gap-4 text-blue-100 text-sm mb-6">
              <span>December 18, 2024</span>
              <span>•</span>
              <span>15 min read</span>
              <span>•</span>
              <span>Complete Course</span>
            </div>
            <Link href="/blog/complete-stock-market-course" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block">
              Start Learning →
            </Link>
          </div>
        </div>
      </div>

      {/* Ad Placement - After Featured Content */}
      <div className="mb-12">
        <ContentAwareAd 
          adSlot={getAdSlot('leaderboardTop')} 
          className="max-w-4xl mx-auto"
          minContentLength={800}
        />
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                  {post.category}
                </span>
                <span className="text-gray-400 text-xs">{post.readTime}</span>
              </div>
              
              <h2 className="text-xl font-bold mb-3 line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{post.date}</span>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Educational Resources */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Educational Resources</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
              📚
            </div>
            <h3 className="text-xl font-bold mb-3">Trading Glossary</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive dictionary of trading terms, market jargon, and financial concepts.
            </p>
            <Link href="/glossary" className="text-green-600 hover:text-green-700 font-medium">
              Browse Terms →
            </Link>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
              🎯
            </div>
            <h3 className="text-xl font-bold mb-3">Trading Strategies</h3>
            <p className="text-gray-600 mb-4">
              Learn proven trading strategies from day trading to long-term investing approaches.
            </p>
            <Link href="/strategies" className="text-purple-600 hover:text-purple-700 font-medium">
              Explore Strategies →
            </Link>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
              📊
            </div>
            <h3 className="text-xl font-bold mb-3">Market Analysis</h3>
            <p className="text-gray-600 mb-4">
              Weekly market updates, sector analysis, and stock recommendations for practice trading.
            </p>
            <Link href="/analysis" className="text-orange-600 hover:text-orange-700 font-medium">
              View Analysis →
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-900 text-white p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated with Market Insights</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Get weekly trading tips, market analysis, and educational content delivered to your inbox. 
          Perfect for improving your trading knowledge.
        </p>
        <div className="flex gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-3">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </section>
    </div>
  )
}