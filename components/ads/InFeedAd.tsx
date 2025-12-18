'use client'

import GoogleAd from './GoogleAd'

interface InFeedAdProps {
  slot: string
  className?: string
}

/**
 * In-Feed Ad - Native ad that blends with content
 * Use this in leaderboard, trade history, etc.
 */
export default function InFeedAd({ slot, className = '' }: InFeedAdProps) {
  return (
    <div className={`my-6 p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
      <GoogleAd adSlot={slot} adFormat="rectangle" fullWidthResponsive={true} />
    </div>
  )
}