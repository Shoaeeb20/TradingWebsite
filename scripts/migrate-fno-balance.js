import 'dotenv/config'
import mongoose from 'mongoose'

async function migrateFnoBalance() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    // Update all users without fnoBalance field
    const result = await mongoose.connection.db
      .collection('users')
      .updateMany({ fnoBalance: { $exists: false } }, { $set: { fnoBalance: 100000 } })

    console.log(`✅ Updated ${result.modifiedCount} users with fnoBalance field`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateFnoBalance()
