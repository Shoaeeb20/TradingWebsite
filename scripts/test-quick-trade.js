// Test script for Quick Trade functionality
// Run with: node scripts/test-quick-trade.js

const BASE_URL = 'http://localhost:3000'

async function testQuickTrade() {
  console.log('🧪 Testing Quick Trade API endpoints...\n')

  // Test 1: Check if order/place endpoint exists
  try {
    const response = await fetch(`${BASE_URL}/api/order/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: 'RELIANCE',
        type: 'BUY',
        orderType: 'MARKET',
        productType: 'INTRADAY',
        quantity: 10
      })
    })

    console.log('📊 Order Place API Status:', response.status)
    
    if (response.status === 401) {
      console.log('✅ API endpoint exists (returns 401 Unauthorized as expected without auth)')
    } else {
      const data = await response.json()
      console.log('📄 Response:', data)
    }
  } catch (error) {
    console.log('❌ Order Place API Error:', error.message)
  }

  // Test 2: Check achievements endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/user/achievements`)
    console.log('\n🏆 Achievements API Status:', response.status)
    
    if (response.status === 401) {
      console.log('✅ Achievements endpoint exists (returns 401 Unauthorized as expected without auth)')
    } else {
      const data = await response.json()
      console.log('📄 Response:', data)
    }
  } catch (error) {
    console.log('❌ Achievements API Error:', error.message)
  }

  // Test 3: Check user progress endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/user/progress`)
    console.log('\n📈 User Progress API Status:', response.status)
    
    if (response.status === 401) {
      console.log('✅ User Progress endpoint exists (returns 401 Unauthorized as expected without auth)')
    } else {
      const data = await response.json()
      console.log('📄 Response:', data)
    }
  } catch (error) {
    console.log('❌ User Progress API Error:', error.message)
  }

  console.log('\n🎯 Quick Trade API Test Complete!')
  console.log('\n📝 Next Steps:')
  console.log('1. Start your development server: npm run dev')
  console.log('2. Login to test the actual trading functionality')
  console.log('3. Try the quick trade buttons on the market page')
  console.log('4. Check the floating action button in bottom-right')
  console.log('5. Monitor achievement unlocks in the console')
}

// Run the test
testQuickTrade().catch(console.error)