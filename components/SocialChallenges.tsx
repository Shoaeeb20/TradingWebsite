'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'weekly' | 'monthly' | 'daily'
  target: number
  current: number
  reward: string
  participants: number
  endDate: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  isParticipating: boolean
}

export default function SocialChallenges() {
  const { data: session } = useSession()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChallenges()
  }, [session])

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/social/challenges')
      if (!response.ok) throw new Error('Failed to fetch challenges')
      
      const data = await response.json()
      setChallenges(data.challenges || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }

  const joinChallenge = async (challengeId: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    try {
      const response = await fetch('/api/social/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      })

      if (response.ok) {
        fetchChallenges() // Refresh challenges
      }
    } catch (error) {
      console.error('Failed to join challenge:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800'
      case 'weekly': return 'bg-purple-100 text-purple-800'
      case 'monthly': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffInHours = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h remaining`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days}d remaining`
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🎯 Community Challenges</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🎯 Community Challenges</h3>
        <button
          onClick={fetchChallenges}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load challenges</p>
          <button 
            onClick={fetchChallenges}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            Try again
          </button>
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">🏆</span>
          <p>New challenges coming soon!</p>
          <p className="text-sm mt-1">Check back later for exciting competitions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
                    {challenge.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {challenge.current}/{challenge.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Challenge Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-600">
                  <span>🏆 {challenge.reward}</span>
                  <span>👥 {challenge.participants} joined</span>
                  <span>⏰ {formatTimeRemaining(challenge.endDate)}</span>
                </div>
                
                {challenge.isParticipating ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    ✓ Joined
                  </span>
                ) : (
                  <button
                    onClick={() => joinChallenge(challenge.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    Join Challenge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!session && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-700">
            <a href="/auth/signin" className="font-medium hover:underline">
              Sign in
            </a>{' '}
            to participate in challenges and win rewards
          </p>
        </div>
      )}
    </div>
  )
}