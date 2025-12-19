import type { Metadata } from 'next'
import CommunityStats from '@/components/CommunityStats'

export const metadata: Metadata = {
  title: 'Trading Community - PaperTrade India',
  description: 'Join our growing community of virtual traders. See community statistics, active traders, and trading activity on PaperTrade India.',
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trading Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of traders learning and practicing on India's premier virtual trading platform. 
            See real-time community statistics and trading activity.
          </p>
        </div>

        {/* Community Stats Component */}
        <CommunityStats />

        {/* Community Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Growing Community</h3>
            <p className="text-gray-600">
              Join thousands of traders from across India learning and practicing together in a supportive environment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Active Trading</h3>
            <p className="text-gray-600">
              Experience live market conditions with real-time trading activity and dynamic market movements.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Learn Together</h3>
            <p className="text-gray-600">
              Learn from successful traders, share strategies, and improve your skills in a risk-free environment.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-6 opacity-90">
            Start your virtual trading journey today and become part of India's most active trading community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/auth/signin" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Trading Free
            </a>
            <a 
              href="/about" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}