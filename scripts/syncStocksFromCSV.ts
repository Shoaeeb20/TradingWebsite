import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { connectDB } from '../lib/db'
import Stock from '../models/Stock'

interface CSVStock {
  symbol: string
  name: string
  sector?: string
}

function parseCSV(filePath: string): CSVStock[] {
  const csvContent = fs.readFileSync(filePath, 'utf-8')
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  // Skip header row
  const dataLines = lines.slice(1)
  
  const stocks: CSVStock[] = []
  
  for (const line of dataLines) {
    // Handle CSV with commas in quotes
    const columns = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''))
    
    if (columns.length >= 2) {
      const symbol = columns[0]?.trim()
      const name = columns[1]?.trim()
      const sector = columns[2]?.trim() || 'General'
      
      if (symbol && name) {
        stocks.push({ symbol, name, sector })
      }
    }
  }
  
  return stocks
}

async function syncStocksFromCSV() {
  try {
    console.log('Connecting to database...')
    await connectDB()

    // Update this path to your CSV file location
    const csvPath = path.resolve(process.cwd(), 'stocks.csv')
    
    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found at:', csvPath)
      console.log('Please place your CSV file at the project root as "stocks.csv"')
      process.exit(1)
    }

    console.log('Reading CSV file...')
    const stocks = parseCSV(csvPath)
    console.log(`Found ${stocks.length} stocks in CSV`)

    if (stocks.length === 0) {
      console.error('No valid stocks found in CSV')
      process.exit(1)
    }

    console.log('Syncing stocks to database...')
    let upserted = 0
    const batchSize = 50

    // Process in batches to avoid overwhelming the database
    for (let i = 0; i < stocks.length; i += batchSize) {
      const batch = stocks.slice(i, i + batchSize)
      
      await Promise.all(
        batch.map(async (stock) => {
          await (Stock as any).findOneAndUpdate(
            { symbol: stock.symbol },
            {
              symbol: stock.symbol,
              name: stock.name,
              sector: stock.sector || 'General',
              exchange: 'NSE',
              active: true,
            },
            { upsert: true }
          )
        })
      )

      upserted += batch.length
      console.log(`Processed ${upserted}/${stocks.length} stocks...`)
      
      // Small delay between batches
      if (i + batchSize < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    console.log(`✓ Successfully synced ${upserted} stocks from CSV`)
    
    // Show some sample stocks
    console.log('\nSample stocks added:')
    stocks.slice(0, 5).forEach(stock => {
      console.log(`  ${stock.symbol} - ${stock.name} (${stock.sector})`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  }
}

syncStocksFromCSV()