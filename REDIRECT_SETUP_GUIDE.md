# 🔄 Temporary Site Redirect Setup Guide

## Overview
This guide explains how to set up and manage temporary 302 redirects from your old site (`papertrade-india.vercel.app`) to your new site (`https://papertrade-india2.vercel.app`).

## 🚀 Current Configuration

### Source (Old Site)
- **URL**: `papertrade-india.vercel.app`
- **Redirect Status**: ✅ ENABLED
- **Redirect Type**: 302 (Temporary)

### Destination (New Site)
- **URL**: `https://papertrade-india2.vercel.app`
- **Path Preservation**: ✅ YES

## 📋 How It Works

### Redirect Examples
```
OLD SITE                           →  NEW SITE
papertrade-india.vercel.app        →  https://papertrade-india2.vercel.app/
papertrade-india.vercel.app/dashboard  →  https://papertrade-india2.vercel.app/dashboard
papertrade-india.vercel.app/market    →  https://papertrade-india2.vercel.app/market
papertrade-india.vercel.app/fno       →  https://papertrade-india2.vercel.app/fno
papertrade-india.vercel.app/auth/signin?callbackUrl=/dashboard  →  https://papertrade-india2.vercel.app/auth/signin?callbackUrl=/dashboard
```

### What Gets Redirected
- ✅ All page routes (`/`, `/dashboard`, `/market`, `/fno`, etc.)
- ✅ Authentication routes (`/auth/signin`, `/auth/signup`)
- ✅ Query parameters are preserved
- ✅ Hash fragments are preserved

### What Doesn't Get Redirected
- ❌ API routes (`/api/*`) - kept for backward compatibility
- ❌ Static files (`/_next/static/*`, `/favicon.ico`)
- ❌ Service worker (`/sw.js`)
- ❌ SEO files (`/robots.txt`, `/sitemap.xml`)

## 🛠️ Management Instructions

### ✅ To ENABLE Redirects
1. Open `middleware.ts`
2. Set `ENABLE_REDIRECT = true`
3. Deploy to Vercel
4. All traffic from old site will redirect to new site

### ❌ To DISABLE Redirects
1. Open `middleware.ts`
2. Set `ENABLE_REDIRECT = false`
3. Deploy to Vercel
4. Old site will work normally (no redirects)

### 🔧 To Change Destination URL
1. Open `middleware.ts`
2. Update `NEW_SITE_URL` variable
3. Deploy to Vercel

## 📊 SEO Considerations

### ✅ SEO-Safe Features
- **302 Status Code**: Tells search engines this is temporary
- **Path Preservation**: Maintains URL structure
- **Query Parameter Preservation**: Keeps tracking parameters
- **API Routes Excluded**: Prevents breaking integrations

### 🔍 Google Search Console
- Monitor both old and new sites in Google Search Console
- 302 redirects won't transfer PageRank permanently
- Search engines will continue indexing the old site
- Remove redirects when ready to fully migrate

## 🚀 Deployment Steps

### Initial Setup (Enable Redirects)
1. Ensure `middleware.ts` has `ENABLE_REDIRECT = true`
2. Deploy to Vercel:
   ```bash
   git add middleware.ts REDIRECT_SETUP_GUIDE.md
   git commit -m "Add temporary 302 redirects to new site"
   git push
   ```
3. Verify redirects work by visiting old site URLs

### Testing Redirects
```bash
# Test with curl (should return 302)
curl -I https://papertrade-india.vercel.app/
curl -I https://papertrade-india.vercel.app/dashboard
curl -I https://papertrade-india.vercel.app/market

# Expected response headers:
# HTTP/2 302
# location: https://papertrade-india2.vercel.app/[path]
```

### Disabling Redirects (When Ready)
1. Open `middleware.ts`
2. Change `ENABLE_REDIRECT = true` to `ENABLE_REDIRECT = false`
3. Deploy:
   ```bash
   git add middleware.ts
   git commit -m "Disable temporary redirects"
   git push
   ```

## 🔧 Advanced Configuration

### Custom Redirect Rules
If you need custom redirect logic, modify the middleware:

```typescript
// Example: Redirect specific paths differently
if (pathname === '/old-feature') {
  return NextResponse.redirect(`${NEW_SITE_URL}/new-feature`, 302)
}

// Example: Add redirect tracking
const redirectUrl = `${NEW_SITE_URL}${fullPath}?redirect_from=old_site`
```

### Environment-Based Configuration
For more control, use environment variables:

```typescript
// In middleware.ts
const ENABLE_REDIRECT = process.env.ENABLE_REDIRECT === 'true'
const NEW_SITE_URL = process.env.NEW_SITE_URL || 'https://papertrade-india2.vercel.app'
```

Then set in Vercel dashboard:
- `ENABLE_REDIRECT=true`
- `NEW_SITE_URL=https://papertrade-india2.vercel.app`

## 📝 Monitoring & Logs

### Vercel Function Logs
- Check Vercel dashboard → Functions tab
- Look for redirect logs: `🔄 Redirecting: ...`
- Monitor for any errors or issues

### Analytics Tracking
- Set up redirect tracking in Google Analytics
- Monitor traffic flow from old to new site
- Track user behavior after redirects

## ⚠️ Important Notes

1. **Temporary Nature**: 302 redirects are temporary - don't use for permanent moves
2. **Performance**: Redirects add ~100-200ms latency
3. **User Experience**: Users will see URL change in browser
4. **Mobile Apps**: If you have mobile apps, update API endpoints
5. **Third-party Integrations**: Update webhook URLs and API endpoints

## 🆘 Troubleshooting

### Redirects Not Working
1. Check `ENABLE_REDIRECT = true` in `middleware.ts`
2. Verify deployment completed successfully
3. Clear browser cache and test in incognito mode
4. Check Vercel function logs for errors

### Infinite Redirect Loops
1. Ensure `OLD_SITE_URL` and `NEW_SITE_URL` are different
2. Check hostname detection logic
3. Verify middleware matcher configuration

### API Routes Breaking
1. Confirm API routes are excluded in matcher
2. Update any hardcoded API URLs in frontend
3. Consider keeping API routes on old site temporarily

## 📞 Quick Reference

| Action | File | Setting |
|--------|------|---------|
| Enable Redirects | `middleware.ts` | `ENABLE_REDIRECT = true` |
| Disable Redirects | `middleware.ts` | `ENABLE_REDIRECT = false` |
| Change Destination | `middleware.ts` | Update `NEW_SITE_URL` |
| Test Redirects | Browser/curl | Visit old site URLs |

---

**Last Updated**: December 2024  
**Status**: ✅ Active Redirects Enabled  
**Next Review**: After migration completion