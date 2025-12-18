'use client'

import GoogleAd from './GoogleAd'

interface DisplayAdProps {
  slot: string
  className?: string
}

/**
 * Display Ad - Responsive banner ad
 * Use this for general banner ads across the site
 */
export default function DisplayAd({ slot, className = '' }: DisplayAdProps) {
  return (
    <div className={`my-4 ${className}`}>
      <GoogleAd adSlot={slot} adFormat="auto" fullWidthResponsive={true} />
    </div>
  )
}