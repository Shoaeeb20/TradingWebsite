import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 🚨 TEMPORARY REDIRECT CONFIGURATION
// Set ENABLE_REDIRECT to false to disable all redirects
const ENABLE_REDIRECT = true // ⚠️ Change to false to disable redirects

// New site URL (destination for redirects)
const NEW_SITE_URL = 'https://papertrade-india2.vercel.app'

// Old site URL (source - where redirects come from)
const OLD_SITE_URL = 'papertrade-india.vercel.app'

export function middleware(request: NextRequest) {
  // Skip redirect if disabled
  if (!ENABLE_REDIRECT) {
    return NextResponse.next()
  }

  // Get the current hostname
  const hostname = request.headers.get('host')
  
  // Only redirect if request is coming from the old site
  if (hostname === OLD_SITE_URL) {
    // Preserve the full path and query parameters
    const pathname = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams.toString()
    const fullPath = pathname + (searchParams ? `?${searchParams}` : '')
    
    // Construct the new URL with preserved path
    const redirectUrl = `${NEW_SITE_URL}${fullPath}`
    
    // Log the redirect for debugging (remove in production if needed)
    console.log(`🔄 Redirecting: ${hostname}${fullPath} → ${redirectUrl}`)
    
    // Return 302 temporary redirect (SEO-safe)
    return NextResponse.redirect(redirectUrl, 302)
  }

  // Continue with normal request processing
  return NextResponse.next()
}

// Configure which routes this middleware should run on
export const config = {
  // Run on all routes except static files and API routes that shouldn't redirect
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - keep these on old site for backward compatibility)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|robots.txt|sitemap.xml).*)',
  ],
}