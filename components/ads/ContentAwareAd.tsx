'use client'

import { usePathname } from 'next/navigation'
import { shouldShowAds } from '@/lib/adsense'
import GoogleAd from './GoogleAd'

interface ContentAwareAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  className?: string
  minContentLength?: number
}

/**
 * Content-aware ad component that only shows ads on appropriate pages
 * with sufficient content to comply with AdSense policies
 */
export default function ContentAwareAd({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  minContentLength = 500,
}: ContentAwareAdProps) {
  const pathname = usePathname()
  
  // Check if ads should be shown on this page
  if (!shouldShowAds(pathname, minContentLength)) {
    return null
  }
  
  // Don't show ads during development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 p-4 text-center text-gray-500 ${className}`}>
        <p className="text-sm">Ad Placeholder (Development Mode)</p>
        <p className="text-xs">Slot: {adSlot}</p>
      </div>
    )
  }
  
  return (
    <div className={`ad-container ${className}`}>
      <GoogleAd 
        adSlot={adSlot}
        adFormat={adFormat}
        fullWidthResponsive={fullWidthResponsive}
      />
    </div>
  )
}