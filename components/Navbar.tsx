'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            PaperTrade 🇮🇳
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/market-info" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Market Info
            </Link>
            <Link href="/simulator-info" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Simulator Info
            </Link>
            <Link href="/simulator" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Simulator
            </Link>
            <Link href="/leaderboard-info" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Performance
            </Link>
            {session && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/market" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Market
                </Link>
                <Link href="/fno" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  F&O
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

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-gray-100 rounded-full">
                  {session.user?.name}
                </span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/market-info" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Market Info
              </Link>
              <Link 
                href="/simulator-info" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Simulator Info
              </Link>
              <Link 
                href="/simulator" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Simulator
              </Link>
              <Link 
                href="/leaderboard-info" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Performance
              </Link>
              {session && (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/market" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Market
                  </Link>
                  <Link 
                    href="/fno" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    F&O
                  </Link>
                  <Link 
                    href="/portfolio" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Portfolio
                  </Link>
                  <Link 
                    href="/leaderboard" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Leaderboard
                  </Link>
                </>
              )}
              
              {/* Mobile Auth */}
              <div className="pt-3 border-t border-gray-200">
                {session ? (
                  <>
                    <div className="text-sm font-medium text-gray-700 px-2 py-1 mb-2">
                      {session.user?.name}
                    </div>
                    <button 
                      onClick={() => { signOut(); setIsOpen(false); }} 
                      className="btn btn-secondary text-sm w-full"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth/signin" 
                    className="btn btn-primary text-sm w-full block text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
