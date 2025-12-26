'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const FreeTierBanner = () => {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Define routes where banner should appear
  const targetRoutes = ['/dashboard', '/market', '/fno']

  useEffect(() => {
    // Check if current route is in target routes
    const shouldShow = targetRoutes.includes(pathname)
    
    if (!shouldShow) {
      setIsVisible(false)
      return
    }

    // Check localStorage for dismissal status
    const isDismissed = localStorage.getItem('freeTierBannerDismissed') === 'true'
    
    if (!isDismissed) {
      setIsVisible(true)
    }
  }, [pathname])

  const handleDismiss = () => {
    localStorage.setItem('freeTierBannerDismissed', 'true')
    setIsVisible(false)
  }

  // Don't render if not visible or not on target routes
  if (!isVisible || !targetRoutes.includes(pathname)) {
    return null
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 relative">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-blue-400 text-xl">ℹ️</div>
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm text-blue-800">
            <strong className="font-semibold">Notice:</strong> This app is hosted on a free tier to keep core features free for all users. Because of usage limits, it may temporarily stop responding after a few days. Functionality returns automatically after the monthly reset.
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="inline-flex text-blue-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200"
            aria-label="Dismiss notice"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FreeTierBanner