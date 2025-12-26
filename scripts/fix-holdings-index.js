/**
 * Database migration script to fix Holdings collection index
 * This script removes the old userId_1_symbol_1 index and ensures
 * the correct userId_1_symbol_1_productType_1 index exists
 */

const { MongoClient } = require('mongodb')

async function fixHoldingsIndex() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI environment variable is required')
    process.exit(1)
  }

  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('paper-trading')
    const holdingsCollection = db.collection('holdings')
    
    // Get existing indexes
    const indexes = await holdingsCollection.indexes()
    console.log('Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })))
    
    // Check if old problematic index exists
    const oldIndex = indexes.find(idx => 
      idx.name === 'userId_1_symbol_1' && 
      !idx.key.productType
    )
    
    if (oldIndex) {
      console.log('Found old problematic index, dropping it...')
      await holdingsCollection.dropIndex('userId_1_symbol_1')
      console.log('Old index dropped successfully')
    } else {
      console.log('No problematic old index found')
    }
    
    // Ensure correct compound index exists
    try {
      await holdingsCollection.createIndex(
        { userId: 1, symbol: 1, productType: 1 },
        { unique: true, name: 'userId_1_symbol_1_productType_1' }
      )
      console.log('Correct compound index created/verified')
    } catch (error) {
      if (error.code === 85) {
        console.log('Correct index already exists')
      } else {
        throw error
      }
    }
    
    // Verify final indexes
    const finalIndexes = await holdingsCollection.indexes()
    console.log('Final indexes:', finalIndexes.map(idx => ({ name: idx.name, key: idx.key })))
    
    console.log('Holdings index migration completed successfully!')
    
  } catch (error) {
    console.error('Error during migration:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Run the migration
fixHoldingsIndex()