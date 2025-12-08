'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              PaperTrade
            </Link>
            {session && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/market" className="text-gray-700 hover:text-primary">
                  Market
                </Link>
                <Link href="/portfolio" className="text-gray-700 hover:text-primary">
                  Portfolio
                </Link>
                <Link href="/leaderboard" className="text-gray-700 hover:text-primary">
                  Leaderboard
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-gray-600">{session.user?.name}</span>
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
