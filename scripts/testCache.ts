import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env.local')
const envPathFallback = join(__dirname, '..', '.env')

try {
  dotenv.config({ path: envPath })
} catch {
  dotenv.config({ path: envPathFallback })
}

import { getCachedPrice, refreshAllPrices } from '../lib/priceCache.js'

async function testCache() {
  console.log('🧪 Testing Price Cache System...\n')
  
  try {
    // Test 1: Get cached price (should fallback to Yahoo)
    console.log('1. Testing getCachedPrice() with fallback...')
    const price1 = await getCachedPrice('RELIANCE')
    console.log(`   RELIANCE price: ₹${price1}\n`)
    
    // Test 2: Get same price again (should use cache)
    console.log('2. Testing getCachedPrice() from cache...')
    const price2 = await getCachedPrice('RELIANCE')
    console.log(`   RELIANCE price: ₹${price2} (cached)\n`)
    
    // Test 3: Refresh all prices
    console.log('3. Testing refreshAllPrices()...')
    const result = await refreshAllPrices()
    console.log(`   Refreshed: ${result.success} success, ${result.failed} failed\n`)
    
    // Test 4: Get multiple cached prices
    console.log('4. Testing multiple cached prices...')
    const symbols = ['RELIANCE', 'TCS', 'INFY']
    for (const symbol of symbols) {
      const price = await getCachedPrice(symbol)
      console.log(`   ${symbol}: ₹${price}`)
    }
    
    console.log('\n✅ Cache system test completed successfully!')
    
  } catch (error) {
    console.error('❌ Cache test failed:', error)
  }
  
  process.exit(0)
}

testCache()