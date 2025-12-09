import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { connectDB } from '../lib/db'
import Stock from '../models/Stock'

const NSE_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG' },
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', sector: 'Banking' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Infrastructure' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Consumer Goods' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', sector: 'Automobile' },
  { symbol: 'TITAN', name: 'Titan Company Ltd', sector: 'Consumer Goods' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharma' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', sector: 'Cement' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', sector: 'Finance' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', sector: 'FMCG' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', sector: 'IT' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd', sector: 'IT' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd', sector: 'Power' },
  { symbol: 'NTPC', name: 'NTPC Ltd', sector: 'Power' },
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd', sector: 'Energy' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', sector: 'Metals' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', sector: 'Metals' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', sector: 'Metals' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', sector: 'Mining' },
  {
    symbol: 'ADANIPORTS',
    name: 'Adani Ports and Special Economic Zone Ltd',
    sector: 'Infrastructure',
  },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', sector: 'Automobile' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', sector: 'Finance' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', sector: 'Automobile' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', sector: 'Automobile' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', sector: 'Automobile' },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories Ltd", sector: 'Pharma' },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories Ltd", sector: 'Pharma' },
  { symbol: 'CIPLA', name: 'Cipla Ltd', sector: 'Pharma' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd', sector: 'Healthcare' },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd', sector: 'Cement' },
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd', sector: 'Cement' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', sector: 'FMCG' },
  { symbol: 'DABUR', name: 'Dabur India Ltd', sector: 'FMCG' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd', sector: 'FMCG' },
  { symbol: 'MARICO', name: 'Marico Ltd', sector: 'FMCG' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd', sector: 'Chemicals' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', sector: 'Banking' },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Banking' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd', sector: 'Insurance' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd', sector: 'Insurance' },
  {
    symbol: 'ICICIPRULI',
    name: 'ICICI Prudential Life Insurance Company Ltd',
    sector: 'Insurance',
  },
  { symbol: 'BAJAJHLDNG', name: 'Bajaj Holdings & Investment Ltd', sector: 'Finance' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Conglomerate' },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd', sector: 'Power' },
  { symbol: 'ADANITRANS', name: 'Adani Transmission Ltd', sector: 'Power' },
  { symbol: 'VEDL', name: 'Vedanta Ltd', sector: 'Metals' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd', sector: 'Energy' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd', sector: 'Energy' },
  { symbol: 'GAIL', name: 'GAIL (India) Ltd', sector: 'Energy' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd', sector: 'FMCG' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', sector: 'Power' },
  { symbol: 'SIEMENS', name: 'Siemens Ltd', sector: 'Engineering' },
  { symbol: 'BOSCHLTD', name: 'Bosch Ltd', sector: 'Automobile' },
  { symbol: 'HAVELLS', name: 'Havells India Ltd', sector: 'Consumer Goods' },
  { symbol: 'VOLTAS', name: 'Voltas Ltd', sector: 'Consumer Goods' },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd', sector: 'Cement' },
  { symbol: 'ACC', name: 'ACC Ltd', sector: 'Cement' },
  { symbol: 'DLF', name: 'DLF Ltd', sector: 'Real Estate' },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd', sector: 'Real Estate' },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd', sector: 'Real Estate' },
  { symbol: 'MCDOWELL-N', name: 'United Spirits Ltd', sector: 'FMCG' },
  { symbol: 'UBL', name: 'United Breweries Ltd', sector: 'FMCG' },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive (India) Ltd', sector: 'FMCG' },
  { symbol: 'BERGEPAINT', name: 'Berger Paints India Ltd', sector: 'Consumer Goods' },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd', sector: 'Aviation' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Technology' },
  { symbol: 'PAYTM', name: 'One 97 Communications Ltd', sector: 'Technology' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd', sector: 'E-commerce' },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd', sector: 'Retail' },
  { symbol: 'TRENT', name: 'Trent Ltd', sector: 'Retail' },
  { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks Ltd', sector: 'Food Services' },
  { symbol: 'PVR', name: 'PVR Ltd', sector: 'Entertainment' },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd', sector: 'IT' },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd', sector: 'IT' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd', sector: 'IT' },
  { symbol: 'COFORGE', name: 'Coforge Ltd', sector: 'IT' },
  { symbol: 'MINDTREE', name: 'Mindtree Ltd', sector: 'IT' },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd', sector: 'Finance' },
  {
    symbol: 'CHOLAFIN',
    name: 'Cholamandalam Investment and Finance Company Ltd',
    sector: 'Finance',
  },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Ltd', sector: 'Finance' },
  { symbol: 'PFC', name: 'Power Finance Corporation Ltd', sector: 'Finance' },
  { symbol: 'RECLTD', name: 'REC Ltd', sector: 'Finance' },
  {
    symbol: 'IRCTC',
    name: 'Indian Railway Catering and Tourism Corporation Ltd',
    sector: 'Tourism',
  },
  { symbol: 'CONCOR', name: 'Container Corporation of India Ltd', sector: 'Logistics' },
  { symbol: 'ABFRL', name: 'Aditya Birla Fashion and Retail Ltd', sector: 'Retail' },
  { symbol: 'PAGEIND', name: 'Page Industries Ltd', sector: 'Textile' },
  { symbol: 'DIXON', name: 'Dixon Technologies (India) Ltd', sector: 'Electronics' },
]

async function syncStocks() {
  try {
    console.log('Connecting to database...')
    await connectDB()

    console.log(`Syncing ${NSE_STOCKS.length} stocks...`)

    let upserted = 0
    for (const stock of NSE_STOCKS) {
      await (Stock as any).findOneAndUpdate(
        { symbol: stock.symbol },
        {
          symbol: stock.symbol,
          name: stock.name,
          sector: stock.sector,
          exchange: 'NSE',
          active: true,
        },
        { upsert: true }
      )

      upserted++
      if (upserted % 20 === 0) {
        console.log(`Upserted ${upserted} stocks...`)
      }
    }

    console.log(`✓ Successfully synced ${upserted} stocks`)
    process.exit(0)
  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  }
}

syncStocks()
