'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
              PaperTrade 🇮🇳
            </Link>
            <Link href="/simulator" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Simulator
            </Link>
            {session && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/market" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Market
                </Link>
                <Link href="/portfolio" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Portfolio
                </Link>
                <Link href="/leaderboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Leaderboard
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-gray-100 rounded-full">{session.user?.name}</span>
                <button onClick={() => signOut()} className="btn btn-secondary text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="btn btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
