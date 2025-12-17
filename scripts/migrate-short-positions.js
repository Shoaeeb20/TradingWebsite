const mongoose = require('mongoose')

async function migrateShortPositions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    
    console.log('🔍 Starting migration for existing open short positions...')
    
    // Find only CURRENTLY OPEN intraday short positions (negative quantity)
    // These are positions that exist in holdings collection (not closed yet)
    const shortPositions = await mongoose.connection.db.collection('holdings').find({
      productType: 'INTRADAY',
      quantity: { $lt: 0 }
    }).toArray()
    
    console.log(`📊 Found ${shortPositions.length} open short positions to migrate`)
    
    let migratedUsers = 0
    let totalCredited = 0
    
    for (const position of shortPositions) {
      const shortProceeds = Math.abs(position.quantity) * position.avgPrice
      
      // Credit user balance with missing short proceeds
      const result = await mongoose.connection.db.collection('users').updateOne(
        { _id: position.userId },
        { $inc: { balance: shortProceeds } }
      )
      
      if (result.modifiedCount > 0) {
        migratedUsers++
        totalCredited += shortProceeds
        console.log(`✅ User ${position.userId}: Credited ₹${shortProceeds.toFixed(2)} for ${Math.abs(position.quantity)} ${position.symbol} open short position`)
      }
    }
    
    console.log(`\n🎉 Migration completed successfully!`)
    console.log(`👥 Users migrated: ${migratedUsers}`)
    console.log(`💰 Total amount credited: ₹${totalCredited.toFixed(2)}`)
    
    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateShortPositions()