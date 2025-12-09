import { NextRequest, NextResponse } from 'next/server'
import { fetchHistoricalData } from '@/lib/yahoo'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const range = searchParams.get('range') || '1mo'

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  const data = await fetchHistoricalData(symbol, range)

  if (!data) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }

  return NextResponse.json(data)
}
