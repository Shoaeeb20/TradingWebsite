// Yahoo Finance API Protection Layer
class YahooProtection {
  private static instance: YahooProtection
  private circuitOpen = false
  private circuitOpenTime = 0
  private requestQueue: Array<() => Promise<any>> = []
  private processing = false
  private pendingRequests = new Map<string, Promise<any>>()
  
  private readonly CIRCUIT_TIMEOUT = 15 * 60 * 1000 // 15 minutes
  private readonly REQUEST_DELAY = 1000 // 1 second between requests

  static getInstance(): YahooProtection {
    if (!YahooProtection.instance) {
      YahooProtection.instance = new YahooProtection()
    }
    return YahooProtection.instance
  }

  // Circuit breaker check
  isCircuitOpen(): boolean {
    if (this.circuitOpen && Date.now() - this.circuitOpenTime > this.CIRCUIT_TIMEOUT) {
      this.circuitOpen = false
      console.log('🔄 Yahoo API circuit breaker reset')
    }
    return this.circuitOpen
  }

  // Open circuit on rate limit
  openCircuit(): void {
    this.circuitOpen = true
    this.circuitOpenTime = Date.now()
    console.log('🚨 Yahoo API circuit breaker opened - cooling down for 15 minutes')
  }

  // Request deduplication and queuing
  async queueRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T | null> {
    // Circuit breaker check
    if (this.isCircuitOpen()) {
      console.log(`⚡ Circuit open - skipping Yahoo API call for ${key}`)
      return null
    }

    // Check if same request is already pending
    if (this.pendingRequests.has(key)) {
      console.log(`🔄 Deduplicating request for ${key}`)
      return this.pendingRequests.get(key) as Promise<T>
    }

    // Create queued request
    const queuedRequest = new Promise<T | null>((resolve) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn()
          this.pendingRequests.delete(key)
          resolve(result)
        } catch (error: any) {
          // Check for rate limiting
          if (error.response?.status === 429 || error.message?.includes('rate limit')) {
            this.openCircuit()
          }
          this.pendingRequests.delete(key)
          resolve(null)
        }
      })
      this.processQueue()
    })

    this.pendingRequests.set(key, queuedRequest)
    return queuedRequest
  }

  // Process request queue with delays
  private async processQueue(): Promise<void> {
    if (this.processing || this.requestQueue.length === 0) return

    this.processing = true
    
    while (this.requestQueue.length > 0 && !this.isCircuitOpen()) {
      const request = this.requestQueue.shift()
      if (request) {
        await request()
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.REQUEST_DELAY))
        }
      }
    }

    this.processing = false
  }
}

export default YahooProtection