'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface DailyChallenge {
  id: string
  title: string
  description: string
  target: number
  current: number
  reward: string
  timeRemaining: string
  icon: string
}

export default function DailyChallengeNotification() {
  const { data: session } = useSession()
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if notification was dismissed today
    const dismissedToday = localStorage.getItem('dailyChallengeDismissed')
    const today = new Date().toDateString()
    
    if (dismissedToday === today) {
      setDismissed(true)
      setLoading(false)
      return
    }

    if (session?.user?.email) {
      fetchDailyChallenge()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchDailyChallenge = async () => {
    try {
      const response = await fetch('/api/social/challenges')
      if (!response.ok) throw new Error('Failed to fetch challenges')
      
      const data = await response.json()
      const dailyChallenge = data.challenges?.find((c: any) => c.type === 'daily')
      
      if (dailyChallenge && dailyChallenge.current < dailyChallenge.target) {
        setChallenge({
          id: dailyChallenge.id,
          title: dailyChallenge.title,
          description: dailyChallenge.description,
          target: dailyChallenge.target,
          current: dailyChallenge.current,
          reward: dailyChallenge.reward,
          timeRemaining: calculateTimeRemaining(dailyChallenge.endDate),
          icon: dailyChallenge.icon
        })
      }
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffInHours = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((end.getTime() - now.getTime()) / (1000 * 60))
      return `${diffInMinutes}m left`
    } else if (diffInHours < 24) {
      return `${diffInHours}h left`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days}d left`
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('dailyChallengeDismissed', new Date().toDateString())
  }

  const handleAcceptChallenge = async () => {
    if (!challenge) return

    try {
      const response = await fetch('/api/social/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.id })
      })

      if (response.ok) {
        // Redirect to market page to start trading
        window.location.href = '/market'
      }
    } catch (error) {
      console.error('Failed to join challenge:', error)
    }
  }

  if (loading || dismissed || !session || !challenge) {
    return null
  }

  const progressPercent = (challenge.current / challenge.target) * 100

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-xl p-6 animate-slide-in-right">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{challenge.icon}</span>
            <h3 className="font-bold text-lg">Daily Challenge!</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-1">{challenge.title}</h4>
          <p className="text-sm opacity-90">{challenge.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{challenge.current}/{challenge.target}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Reward and Time */}
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="bg-white/20 px-2 py-1 rounded-full">
            🏆 {challenge.reward}
          </span>
          <span className="bg-white/20 px-2 py-1 rounded-full">
            ⏰ {challenge.timeRemaining}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAcceptChallenge}
            className="flex-1 bg-white text-orange-600 py-2 px-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm"
          >
            Accept Challenge
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}