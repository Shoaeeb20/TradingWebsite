'use client'

import { useEffect, useState } from 'react'

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  milestone: {
    title: string
    description: string
    icon: string
    reward?: string
  }
}

export default function CelebrationModal({ isOpen, onClose, milestone }: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center relative">
        <div className="text-6xl mb-4 animate-bounce">{milestone.icon}</div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {milestone.title}
        </h2>
        
        <p className="text-gray-700 mb-4">
          {milestone.description}
        </p>

        {milestone.reward && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-yellow-800">
              🎁 <strong>Reward:</strong> {milestone.reward}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Awesome! Continue Trading
        </button>

        <p className="text-xs text-gray-500 mt-3">
          Keep trading to unlock more achievements!
        </p>
      </div>
    </div>
  )
}