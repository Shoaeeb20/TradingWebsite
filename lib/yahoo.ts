import axios from 'axios'

export interface YahooQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: number
}

const YAHOO_CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart'

function toYahooSymbol(symbol: string): string {
  return symbol.includes('.') ? symbol : `${symbol}.NS`
}

export async function fetchQuote(symbol: string, retries = 3, range = '1d'): Promise<YahooQuote | null> {
  const yahooSymbol = toYahooSymbol(symbol)
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(`${YAHOO_CHART_URL}/${yahooSymbol}`, {
        params: {
          interval: '1d',
          range: range,
        },
        timeout: 5000,
      })

      const result = response.data?.chart?.result?.[0]
      if (!result) throw new Error('No data returned')

      const meta = result.meta
      const quote = result.indicators?.quote?.[0]
      
      if (!meta || !quote) throw new Error('Invalid response structure')

      const currentPrice = meta.regularMarketPrice || quote.close?.[quote.close.length - 1]
      const previousClose = meta.previousClose || meta.chartPreviousClose

      if (!currentPrice || !previousClose) throw new Error('Missing price data')

      const change = currentPrice - previousClose
      const changePercent = (change / previousClose) * 100

      return {
        symbol: symbol.replace('.NS', ''),
        price: parseFloat(currentPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: Date.now(),
      }
    } catch (error) {
      if (attempt === retries - 1) {
        console.error(`Failed to fetch ${symbol} after ${retries} attempts:`, error)
        return null
      }
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  return null
}

export async function fetchHistoricalData(symbol: string, range: string): Promise<any[] | null> {
  const yahooSymbol = toYahooSymbol(symbol)
  
  try {
    const response = await axios.get(`${YAHOO_CHART_URL}/${yahooSymbol}`, {
      params: { interval: '1d', range },
      timeout: 5000,
    })

    const result = response.data?.chart?.result?.[0]
    if (!result) return null

    const timestamps = result.timestamp
    const quotes = result.indicators?.quote?.[0]
    
    if (!timestamps || !quotes) return null

    return timestamps.map((ts: number, i: number) => ({
      time: ts * 1000,
      price: quotes.close[i],
      open: quotes.open[i],
      high: quotes.high[i],
      low: quotes.low[i],
      volume: quotes.volume[i]
    })).filter((d: any) => d.price)
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error)
    return null
  }
}

export async function fetchMultipleQuotes(symbols: string[]): Promise<Map<string, YahooQuote>> {
  const results = new Map<string, YahooQuote>()
  
  for (let i = 0; i < symbols.length; i++) {
    const quote = await fetchQuote(symbols[i])
    if (quote) {
      results.set(quote.symbol, quote)
    }
    if (i < symbols.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  return results
}
