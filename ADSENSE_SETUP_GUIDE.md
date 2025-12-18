# Google AdSense Setup Guide

## ✅ What's Already Done

1. **AdSense Script Added** - The Google AdSense script is now loaded in `app/layout.tsx`
2. **Reusable Components Created** - Multiple ad components for different use cases
3. **Configuration System** - Centralized ad slot management
4. **Example Implementation** - Homepage now has strategic ad placements

## 📋 Next Steps to Complete Setup

### 1. Get Your Ad Slot IDs from Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Add your website: `https://papertrade-india.vercel.app`
4. Wait for approval (can take 1-14 days)
5. Once approved, create ad units:
   - **Display Ads** (responsive banners)
   - **In-feed Ads** (native ads for content)
   - **Sidebar Ads** (vertical ads)

### 2. Update Ad Slot IDs

Replace the placeholder slot IDs in `lib/adsense.ts`:

```typescript
adSlots: {
  // Replace these with your actual slot IDs from AdSense
  homepageHeader: 'YOUR_ACTUAL_SLOT_ID_1',
  homepageFooter: 'YOUR_ACTUAL_SLOT_ID_2',
  dashboardSidebar: 'YOUR_ACTUAL_SLOT_ID_3',
  // ... etc
}
```

### 3. Strategic Ad Placements

#### Already Implemented:
- ✅ Homepage header ad (after hero section)
- ✅ Homepage footer ad (before CTA)

#### Recommended Additional Placements:

**Dashboard Page:**
```tsx
import { SidebarAd } from '@/components/ads'
import { getAdSlot } from '@/lib/adsense'

// In sidebar
<SidebarAd slot={getAdSlot('dashboardSidebar')} />
```

**Portfolio Page:**
```tsx
import { DisplayAd, SidebarAd } from '@/components/ads'

// Top of portfolio
<DisplayAd slot={getAdSlot('portfolioTop')} />

// In sidebar
<SidebarAd slot={getAdSlot('portfolioSidebar')} />
```

**Leaderboard Page:**
```tsx
import { InFeedAd } from '@/components/ads'

// Between leaderboard entries (every 5-10 entries)
<InFeedAd slot={getAdSlot('leaderboardInFeed')} />
```

**Market/Trading Pages:**
```tsx
import { DisplayAd, SidebarAd } from '@/components/ads'

// Header ad
<DisplayAd slot={getAdSlot('tradingHeader')} />

// Sidebar ad
<SidebarAd slot={getAdSlot('tradingSidebar')} />
```

## 🎯 Ad Component Usage

### 1. DisplayAd - Responsive Banner
```tsx
import { DisplayAd } from '@/components/ads'
import { getAdSlot } from '@/lib/adsense'

<DisplayAd slot={getAdSlot('homepageHeader')} className="my-8" />
```

### 2. SidebarAd - Vertical Sidebar
```tsx
import { SidebarAd } from '@/components/ads'

<SidebarAd slot={getAdSlot('dashboardSidebar')} className="sticky top-4" />
```

### 3. InFeedAd - Native Content Ad
```tsx
import { InFeedAd } from '@/components/ads'

<InFeedAd slot={getAdSlot('leaderboardInFeed')} className="my-6" />
```

### 4. Custom GoogleAd - Full Control
```tsx
import { GoogleAd } from '@/components/ads'

<GoogleAd 
  adSlot="your-slot-id"
  adFormat="rectangle"
  fullWidthResponsive={false}
  className="max-w-[728px]"
/>
```

## 📊 Best Practices for Trading Apps

### 1. Strategic Placement
- **Above the fold** on homepage (high visibility)
- **Sidebar ads** on dashboard/portfolio (persistent visibility)
- **In-feed ads** in leaderboard/trade history (native feel)
- **Between content sections** (natural breaks)

### 2. User Experience
- Don't overwhelm users with too many ads
- Use native/in-feed ads for better integration
- Ensure ads don't interfere with trading functionality
- Consider ad-free experience for premium users

### 3. Performance Optimization
- Lazy load ads below the fold
- Use responsive ad formats
- Monitor Core Web Vitals impact
- A/B test ad placements

## 🚀 Revenue Optimization Tips

### 1. High-Value Pages
Focus ads on pages with high engagement:
- Homepage (landing page)
- Dashboard (daily usage)
- Portfolio (frequent checks)
- Leaderboard (competitive engagement)

### 2. Ad Formats by Page Type
- **Homepage**: Large display ads
- **Dashboard**: Sidebar + small display
- **Portfolio**: Sidebar + in-feed
- **Leaderboard**: In-feed native ads
- **Market pages**: Display + sidebar

### 3. Targeting
- Financial/investment content performs well
- Educational trading content
- Stock market tools and apps
- Investment platforms

## 🔧 Technical Implementation

### Environment Variables (Optional)
Add to `.env.local` for easier management:
```env
NEXT_PUBLIC_ADSENSE_ID=ca-pub-7953904112923612
NEXT_PUBLIC_ADSENSE_ENABLED=true
```

### Conditional Ad Loading
```tsx
// Only show ads in production
const showAds = process.env.NODE_ENV === 'production' && 
                process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'

{showAds && <DisplayAd slot={getAdSlot('homepageHeader')} />}
```

### Ad Blocker Detection (Advanced)
```tsx
// Detect ad blockers and show alternative content
const [adBlocked, setAdBlocked] = useState(false)

useEffect(() => {
  const testAd = document.createElement('div')
  testAd.innerHTML = '&nbsp;'
  testAd.className = 'adsbox'
  document.body.appendChild(testAd)
  
  setTimeout(() => {
    if (testAd.offsetHeight === 0) {
      setAdBlocked(true)
    }
    document.body.removeChild(testAd)
  }, 100)
}, [])
```

## 📈 Monitoring & Analytics

### 1. AdSense Reports
- Monitor RPM (Revenue per Mille)
- Track CTR (Click-through Rate)
- Analyze top-performing ad units
- Monitor policy compliance

### 2. Google Analytics Integration
- Track ad performance alongside user behavior
- Monitor bounce rate impact
- Analyze user flow with ads

### 3. A/B Testing
- Test different ad placements
- Compare ad formats (display vs native)
- Test ad density (number of ads per page)

## ⚠️ Important Notes

1. **AdSense Approval**: Your site needs to be approved first
2. **Content Policy**: Ensure your trading app complies with AdSense policies
3. **Click Fraud**: Never click your own ads or encourage others to
4. **Mobile Optimization**: Ensure ads work well on mobile devices
5. **Page Speed**: Monitor impact on loading times

## 🎯 Expected Revenue

For a trading/finance app with good traffic:
- **RPM**: $1-5 (varies by geography)
- **CTR**: 0.5-2% (finance content typically performs well)
- **Monthly Revenue**: Depends on traffic volume

With 10,000 monthly page views:
- Conservative: $10-50/month
- Optimistic: $50-200/month

## 📞 Support

If you need help with implementation:
1. Check Google AdSense Help Center
2. Review the component documentation in `/components/ads/`
3. Test ads in development using AdSense test mode
4. Monitor browser console for any AdSense errors

Remember: AdSense revenue grows with traffic, so focus on building a great trading experience first!