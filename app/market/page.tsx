import { connectDB } from '@/lib/db'
import Stock from '@/models/Stock'
import StockCard from '@/components/StockCard'
import Link from 'next/link'
import SearchBox from '@/components/SearchBox'

export const dynamic = 'force-dynamic'

export default async function Market({ searchParams }: { searchParams: { q?: string } }) {
  await connectDB()
  
  const query = searchParams.q || ''
  const filter: any = { active: true }
  
  if (query) {
    filter.$or = [
      { symbol: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } }
    ]
  }
  
  const stocks = await Stock.find(filter).sort({ symbol: 1 }).limit(50).lean()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Market</h1>
        <SearchBox />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <Link key={stock.symbol} href={`/market/${stock.symbol}`}>
            <StockCard symbol={stock.symbol} name={stock.name} />
          </Link>
        ))}
      </div>
      
      {stocks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No stocks found matching "{query}"
        </div>
      )}
    </div>
  )
}
