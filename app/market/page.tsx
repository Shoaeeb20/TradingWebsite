import { connectDB } from '@/lib/db'
import Stock from '@/models/Stock'
import StockCard from '@/components/StockCard'
import Link from 'next/link'
import SearchBox from '@/components/SearchBox'

export const dynamic = 'force-dynamic'

export default async function Market({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  await connectDB()

  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')
  const limit = 24
  const skip = (page - 1) * limit
  
  const filter: any = { active: true }

  if (query) {
    filter.$or = [
      { symbol: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } },
    ]
  }

  const [stocks, totalStocks] = await Promise.all([
    (Stock as any).find(filter).sort({ symbol: 1 }).skip(skip).limit(limit).lean(),
    (Stock as any).countDocuments(filter)
  ])
  
  const totalPages = Math.ceil(totalStocks / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Market</h1>
          <p className="text-gray-600 mt-1">
            {totalStocks} NSE stocks • Page {page} of {totalPages}
          </p>
        </div>
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
          {query ? `No stocks found matching "${query}"` : 'No stocks found'}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          {hasPrev && (
            <Link
              href={`/market?${new URLSearchParams({ ...(query && { q: query }), page: (page - 1).toString() })}`}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              ← Previous
            </Link>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Show page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              if (pageNum > totalPages) return null
              
              return (
                <Link
                  key={pageNum}
                  href={`/market?${new URLSearchParams({ ...(query && { q: query }), page: pageNum.toString() })}`}
                  className={`px-3 py-2 rounded transition-colors ${
                    pageNum === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
          </div>
          
          {hasNext && (
            <Link
              href={`/market?${new URLSearchParams({ ...(query && { q: query }), page: (page + 1).toString() })}`}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
