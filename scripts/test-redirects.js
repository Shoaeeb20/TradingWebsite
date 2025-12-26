#!/usr/bin/env node

/**
 * Test script for verifying 302 redirects
 * Usage: node scripts/test-redirects.js
 */

const https = require('https')
const http = require('http')

const OLD_SITE = 'papertrade-india.vercel.app'
const NEW_SITE = 'https://papertrade-india2.vercel.app'

// Test URLs to check
const testPaths = [
  '/',
  '/dashboard',
  '/market',
  '/fno',
  '/auth/signin',
  '/portfolio',
  '/community',
  '/algo-trading',
  '/trade-ideas'
]

console.log('🔄 Testing 302 Redirects')
console.log('========================')
console.log(`Old Site: ${OLD_SITE}`)
console.log(`New Site: ${NEW_SITE}`)
console.log('')

async function testRedirect(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: OLD_SITE,
      port: 443,
      path: path,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Redirect-Test-Script/1.0'
      }
    }

    const req = https.request(options, (res) => {
      const status = res.statusCode
      const location = res.headers.location
      const expectedLocation = `${NEW_SITE}${path}`
      
      let result = {
        path,
        status,
        location,
        expected: expectedLocation,
        success: false
      }

      if (status === 302 && location === expectedLocation) {
        result.success = true
        console.log(`✅ ${path} → ${location}`)
      } else if (status === 302) {
        console.log(`⚠️  ${path} → ${location} (unexpected destination)`)
      } else {
        console.log(`❌ ${path} → Status ${status} (expected 302)`)
      }

      resolve(result)
    })

    req.on('error', (err) => {
      console.log(`❌ ${path} → Error: ${err.message}`)
      resolve({
        path,
        status: 'ERROR',
        location: null,
        expected: `${NEW_SITE}${path}`,
        success: false,
        error: err.message
      })
    })

    req.setTimeout(5000, () => {
      console.log(`⏰ ${path} → Timeout`)
      req.destroy()
      resolve({
        path,
        status: 'TIMEOUT',
        location: null,
        expected: `${NEW_SITE}${path}`,
        success: false
      })
    })

    req.end()
  })
}

async function runTests() {
  console.log('Testing redirects...\n')
  
  const results = []
  
  for (const path of testPaths) {
    const result = await testRedirect(path)
    results.push(result)
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log('\n📊 Test Summary')
  console.log('================')
  
  const successful = results.filter(r => r.success).length
  const total = results.length
  
  console.log(`✅ Successful: ${successful}/${total}`)
  console.log(`❌ Failed: ${total - successful}/${total}`)
  
  if (successful === total) {
    console.log('\n🎉 All redirects working correctly!')
  } else {
    console.log('\n⚠️  Some redirects need attention.')
    
    const failed = results.filter(r => !r.success)
    console.log('\nFailed redirects:')
    failed.forEach(r => {
      console.log(`  - ${r.path}: Status ${r.status}`)
    })
  }
  
  console.log('\n💡 Tips:')
  console.log('  - If redirects are not working, check ENABLE_REDIRECT in middleware.ts')
  console.log('  - Clear browser cache when testing manually')
  console.log('  - Check Vercel deployment status')
}

// Run the tests
runTests().catch(console.error)