import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { connectDB } from '../lib/db'
import User from '../models/User'

async function migrateUserCapital() {
  try {
    console.log('Connecting to database...')
    await connectDB()

    // Find all users missing the new capital tracking fields
    const usersToMigrate = await (User as any).find({
      $or: [
        { initialCapital: { $exists: false } },
        { totalTopUps: { $exists: false } },
        { totalWithdrawals: { $exists: false } }
      ]
    })

    console.log(`Found ${usersToMigrate.length} users to migrate`)

    if (usersToMigrate.length === 0) {
      console.log('✓ No users need migration')
      process.exit(0)
    }

    let migrated = 0
    for (const user of usersToMigrate) {
      const currentBalance = user.balance || 0
      const currentFnoBalance = user.fnoBalance || 0
      const currentTotalValue = currentBalance + currentFnoBalance

      // Set initialCapital to current portfolio value
      // This ensures 0% return baseline for existing users
      await (User as any).findByIdAndUpdate(user._id, {
        $set: {
          initialCapital: currentTotalValue,
          totalTopUps: 0,
          totalWithdrawals: 0
        }
      })

      migrated++
      console.log(`Migrated user ${user.email}: initialCapital = ₹${currentTotalValue.toLocaleString('en-IN')}`)
    }

    console.log(`✓ Successfully migrated ${migrated} users`)
    console.log('\nMigration Summary:')
    console.log('- initialCapital = current balance + fnoBalance')
    console.log('- totalTopUps = 0 (no previous top-ups)')
    console.log('- totalWithdrawals = 0 (no previous withdrawals)')
    console.log('- All existing users now have 0% return baseline')
    
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrateUserCapital()