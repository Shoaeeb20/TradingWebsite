/**
 * Google AdSense Configuration
 * Manage all ad slots and placements from here
 */

export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-7953904112923612',
  
  // Ad Slots - Replace with your actual ad slot IDs from AdSense
  adSlots: {
    // Homepage ads
    homepageHeader: '1234567890', // Replace with actual slot ID
    homepageFooter: '1234567891', // Replace with actual slot ID
    
    // Dashboard ads
    dashboardSidebar: '1234567892', // Replace with actual slot ID
    dashboardBottom: '1234567893', // Replace with actual slot ID
    
    // Portfolio ads
    portfolioTop: '1234567894', // Replace with actual slot ID
    portfolioSidebar: '1234567895', // Replace with actual slot ID
    
    // Trading page ads
    tradingHeader: '1234567896', // Replace with actual slot ID
    tradingSidebar: '1234567897', // Replace with actual slot ID
    
    // Leaderboard ads
    leaderboardTop: '1234567898', // Replace with actual slot ID
    leaderboardInFeed: '1234567899', // Replace with actual slot ID
    
    // Market info ads
    marketInfoSidebar: '1234567900', // Replace with actual slot ID
    marketInfoBottom: '1234567901', // Replace with actual slot ID
  },
  
  // Ad placement rules
  placements: {
    // Show ads only for non-premium users (if you have premium feature)
    showForPremium: false,
    
    // Minimum time between ads (in milliseconds)
    minTimeBetweenAds: 30000, // 30 seconds
    
    // Maximum ads per page
    maxAdsPerPage: 3,
    
    // Pages where ads should not be shown
    excludePages: [
      '/admin',
      '/api',
    ],
  },
}

/**
 * Check if ads should be shown on current page
 */
export function shouldShowAds(pathname: string): boolean {
  // Don't show ads on excluded pages
  if (ADSENSE_CONFIG.placements.excludePages.some(page => pathname.startsWith(page))) {
    return false
  }
  
  // Add more logic here (e.g., user subscription status)
  return true
}

/**
 * Get ad slot ID by name
 */
export function getAdSlot(slotName: keyof typeof ADSENSE_CONFIG.adSlots): string {
  return ADSENSE_CONFIG.adSlots[slotName]
}