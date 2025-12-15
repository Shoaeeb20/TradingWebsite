'use client'

import { useState, useEffect } from 'react'

export default function GrowwReferral() {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const lastDismissed = localStorage.getItem('groww-referral-dismissed')
    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed)
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      setDismissed(daysSinceDismissed < 7) // Hide for 7 days
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('groww-referral-dismissed', Date.now().toString())
  }

  if (!mounted || dismissed) return null

  return (
    <div className="card mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">🚀</div>
            <h3 className="text-lg font-semibold text-green-800">Ready for Real Trading?</h3>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Take the next step with a <strong>free demat account</strong> on Groww - India's most
            trusted investment platform with zero brokerage on delivery trades.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://app.groww.in/v3cO/8d4nilel"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm inline-flex items-center gap-2"
            >
              📈 Open Free Demat Account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <span>💡</span>
              <span>
                Use referral code: <strong>EMOW1T</strong> • Zero investment required
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
