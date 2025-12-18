'use client'

import GoogleAd from './GoogleAd'

interface SidebarAdProps {
  slot: string
  className?: string
}

/**
 * Sidebar Ad - Vertical ad for sidebars
 * Use this in portfolio, dashboard sidebars
 */
export default function SidebarAd({ slot, className = '' }: SidebarAdProps) {
  return (
    <div className={`my-4 ${className}`}>
      <GoogleAd 
        adSlot={slot} 
        adFormat="vertical" 
        fullWidthResponsive={false}
        className="max-w-[300px]"
      />
    </div>
  )
}