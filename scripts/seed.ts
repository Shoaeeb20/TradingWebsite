import dotenv from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'

// Load environment variables BEFORE any other imports
if (existsSync(path.join(process.cwd(), '.env.local'))) {
  dotenv.config({ path: path.join(process.cwd(), '.env.local') })
} else if (existsSync(path.join(process.cwd(), '.env'))) {
  dotenv.config({ path: path.join(process.cwd(), '.env') })
} else {
  dotenv.config()
}

import { connectDB } from '../lib/db'
import User from '../models/User'
import Stock from '../models/Stock'
import Trade from '../models/Trade'
import Holding from '../models/Holding'
import Order from '../models/Order'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

async function seed() {
  try {
    console.log('Connecting to database...')
    await connectDB()

    console.log('Creating demo user...')
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const existingUser = await (User as any).findOne({ email: 'demo@example.com' })
    let user

    if (existingUser) {
      console.log('Demo user already exists, resetting balance...')
      existingUser.balance = 100000
      await existingUser.save()
      user = existingUser
    } else {
      user = await (User as any).create({
        email: 'demo@example.com',
        name: 'Demo User',
        password: hashedPassword,
        balance: 100000,
      })
      console.log('✓ Demo user created')
    }

    console.log('Checking stocks...')
    const stockCount = await (Stock as any).countDocuments()
    if (stockCount === 0) {
      console.log('No stocks found. Run npm run sync-stocks first.')
      process.exit(1)
    }

    console.log('Creating sample trades...')
    const stocks = await (Stock as any).find().limit(5).lean()

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      for (let i = 0; i < 5; i++) {
        const stock = stocks[i]
        const quantity = (i + 1) * 10
        const price = 100 + i * 50

        const order = await (Order as any).create(
          [
            {
              userId: user._id,
              symbol: stock.symbol,
              type: 'BUY',
              orderType: 'MARKET',
              quantity,
              status: 'FILLED',
              filledQuantity: quantity,
              avgFillPrice: price,
              filledAt: new Date(),
            },
          ],
          { session }
        )

        await (Trade as any).create(
          [
            {
              orderId: order[0]._id,
              userId: user._id,
              symbol: stock.symbol,
              type: 'BUY',
              quantity,
              price,
              total: quantity * price,
            },
          ],
          { session }
        )

        await (Holding as any).create(
          [
            {
              userId: user._id,
              symbol: stock.symbol,
              quantity,
              avgPrice: price,
            },
          ],
          { session }
        )

        user.balance -= quantity * price
      }

      await user.save({ session })
      await session.commitTransaction()
      console.log('✓ Sample trades created')
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }

    console.log('\n=== Seed Complete ===')
    console.log('Demo User Credentials:')
    console.log('Email: demo@example.com')
    console.log('Password: demo123')
    console.log(`Balance: ₹${user.balance.toLocaleString('en-IN')}`)
    console.log('=====================\n')

    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seed()
