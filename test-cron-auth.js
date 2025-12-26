// Test script for cron authentication
// Run with: node test-cron-auth.js

const CRON_SECRET = 'your-random-cron-secret-key-change-this'
const BASE_URL = 'http://localhost:3000' // Change to your domain for production

async function testAlgoExecute() {
  console.log('Testing /api/algo/execute...')
  
  const url = `${BASE_URL}/api/algo/execute?secret=${CRON_SECRET}`
  console.log('URL:', url)
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }
}

async function testRefreshPrices() {
  console.log('\nTesting /api/cron/refresh-prices...')
  
  const url = `${BASE_URL}/api/cron/refresh-prices`
  console.log('URL:', url)
  console.log('Authorization Header:', `Bearer ${CRON_SECRET}`)
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    })
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }
}

async function main() {
  console.log('CRON Authentication Test')
  console.log('========================')
  console.log('CRON_SECRET:', CRON_SECRET)
  console.log('BASE_URL:', BASE_URL)
  console.log('')
  
  await testAlgoExecute()
  await testRefreshPrices()
}

main().catch(console.error)