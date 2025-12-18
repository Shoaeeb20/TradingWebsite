# Google AdSense Setup Guide for PaperTrade India

## ✅ Pages Created for AdSense Approval

### Required Pages (All Created)
1. **Privacy Policy** - `/privacy-policy`
2. **Terms of Service** - `/terms-of-service` 
3. **About Us** - `/about`
4. **Contact** - `/contact`
5. **Disclaimer** - `/disclaimer`

### AdSense Integration
- ✅ AdSense script added to layout.tsx
- ✅ Reusable ad components created
- ✅ Ad configuration system setup
- ✅ Strategic ad placements added

## 🚀 Next Steps for AdSense Approval

### 1. Update Ad Slot IDs
Replace placeholder slot IDs in `lib/adsense.ts` with your actual AdSense slot IDs:

```typescript
adSlots: {
  homepageHeader: 'YOUR_ACTUAL_SLOT_ID_1',
  homepageFooter: 'YOUR_ACTUAL_SLOT_ID_2',
  // ... update all slots
}
```

### 2. Content Requirements
- ✅ High-quality, original content
- ✅ Clear navigation and user experience
- ✅ Mobile-responsive design
- ✅ Fast loading times

### 3. Traffic Requirements
- Get organic traffic before applying
- Ensure good user engagement
- Have regular content updates

### 4. Technical Requirements
- ✅ HTTPS enabled (Vercel provides this)
- ✅ Mobile-friendly design
- ✅ Fast page load speeds
- ✅ Clean, professional design

## 📋 AdSense Application Checklist

### Before Applying:
- [ ] Website has substantial, original content
- [ ] All required pages are live and accessible
- [ ] Website gets regular organic traffic
- [ ] No copyright violations
- [ ] Clean, professional design
- [ ] Working contact information
- [ ] Clear website purpose and value

### During Application:
- [ ] Apply through Google AdSense website
- [ ] Add your website URL
- [ ] Verify website ownership
- [ ] Wait for approval (can take days to weeks)

### After Approval:
- [ ] Replace placeholder ad slot IDs with real ones
- [ ] Test ad placements
- [ ] Monitor ad performance
- [ ] Ensure compliance with AdSense policies

## 🎯 Strategic Ad Placements

### Current Placements:
1. **Homepage Header** - After hero section
2. **Homepage Footer** - Before CTA section

### Recommended Additional Placements:
- Dashboard sidebar
- Portfolio page top
- Leaderboard in-feed ads
- Market info pages

## 📱 Ad Components Usage

```tsx
import { DisplayAd, SidebarAd, InFeedAd } from '@/components/ads'
import { getAdSlot } from '@/lib/adsense'

// Display ad (responsive banner)
<DisplayAd slot={getAdSlot('homepageHeader')} />

// Sidebar ad (vertical)
<SidebarAd slot={getAdSlot('dashboardSidebar')} />

// In-feed ad (native)
<InFeedAd slot={getAdSlot('leaderboardInFeed')} />
```

## ⚠️ Important Notes

1. **Don't click your own ads** - This can get you banned
2. **Follow AdSense policies** - No prohibited content
3. **Monitor performance** - Track earnings and CTR
4. **Be patient** - Approval can take time
5. **Quality over quantity** - Better to have fewer, well-placed ads

## 🔧 Troubleshooting

### Ads Not Showing?
- Check ad slot IDs are correct
- Verify AdSense script is loaded
- Check browser console for errors
- Ensure sufficient content around ads

### Low Earnings?
- Optimize ad placements
- Improve content quality
- Increase website traffic
- Test different ad formats

Your website is now ready for AdSense application!