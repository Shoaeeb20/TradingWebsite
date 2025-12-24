'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface CleanupStats {
  eligibleTrades: number
  eligibleOrders: number
  oldestTradeDate?: string
  newestTradeDate?: string
  oldestOrderDate?: string
  newestOrderDate?: string
}

interface CleanupResult {
  tradesProcessed: number
  ordersProcessed: number
  dailyPnLCreated: number
  tradesArchived: number
  tradesDeleted: number
  ordersArchived: number
  ordersDeleted: number
}

interface CleanupLog {
  _id: string
  operationType: 'MANUAL' | 'AUTOMATED'
  operationStatus: 'SUCCESS' | 'FAILED' | 'PARTIAL'
  startedAt: string
  completedAt?: string
  tradesProcessed: number
  ordersProcessed: number
  dailyPnLCreated: number
  errorMessage?: string
  triggeredBy?: {
    name: string
    email: string
  }
}

export default function DataCleanupPanel() {
  const [stats, setStats] = useState<CleanupStats | null>(null)
  const [logs, setLogs] = useState<CleanupLog[]>([])
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState<CleanupResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    fetchLogs()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/data-cleanup/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError('Failed to fetch cleanup statistics')
      }
    } catch (err) {
      setError('Network error while fetching stats')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/data-cleanup/logs?limit=10')
      const data = await response.json()
      
      if (data.success) {
        setLogs(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    }
  }

  const executeCleanup = async () => {
    try {
      setExecuting(true)
      setError(null)
      setResult(null)
      
      const response = await fetch('/api/admin/data-cleanup/execute', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setResult(data.data)
        setShowConfirm(false)
        // Refresh stats and logs
        await fetchStats()
        await fetchLogs()
      } else {
        setError(data.error || 'Cleanup operation failed')
      }
    } catch (err) {
      setError('Network error during cleanup execution')
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Data Cleanup Management</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-green-800 mb-2">Cleanup Completed Successfully!</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>• Trades processed: {result.tradesProcessed}</p>
            <p>• Orders processed: {result.ordersProcessed}</p>
            <p>• Daily P&L summaries created: {result.dailyPnLCreated}</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Cleanup Statistics</h3>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
          </div>
        ) : stats ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Eligible trades (30+ days old):</span>
              <span className="font-semibold">{stats.eligibleTrades}</span>
            </div>
            <div className="flex justify-between">
              <span>Eligible orders (60+ days old):</span>
              <span className="font-semibold">{stats.eligibleOrders}</span>
            </div>
            {stats.oldestTradeDate && (
              <div className="flex justify-between">
                <span>Oldest trade:</span>
                <span className="text-gray-600">
                  {formatDistanceToNow(new Date(stats.oldestTradeDate), { addSuffix: true })}
                </span>
              </div>
            )}
            {stats.oldestOrderDate && (
              <div className="flex justify-between">
                <span>Oldest order:</span>
                <span className="text-gray-600">
                  {formatDistanceToNow(new Date(stats.oldestOrderDate), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Failed to load statistics</p>
        )}
      </div>

      {/* Actions */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Actions</h3>
        <div className="space-y-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="btn btn-secondary w-full"
          >
            {loading ? 'Refreshing...' : 'Refresh Statistics'}
          </button>
          
          <button
            onClick={() => setShowConfirm(true)}
            disabled={executing || !stats || (stats.eligibleTrades === 0 && stats.eligibleOrders === 0)}
            className="btn btn-primary w-full"
          >
            {executing ? 'Executing Cleanup...' : 'Execute Data Cleanup'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Data Cleanup</h3>
            <div className="mb-4 text-sm space-y-2">
              <p>This operation will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Archive {stats?.eligibleTrades || 0} old trades</li>
                <li>Archive {stats?.eligibleOrders || 0} old orders</li>
                <li>Create daily P&L summaries</li>
                <li>Free up database storage space</li>
              </ul>
              <p className="text-red-600 font-semibold mt-3">
                This operation cannot be undone!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={executeCleanup}
                disabled={executing}
                className="btn btn-primary flex-1"
              >
                {executing ? 'Executing...' : 'Confirm Cleanup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Logs */}
      <div>
        <h3 className="font-semibold mb-3">Recent Cleanup Operations</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No cleanup operations yet</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 5).map((log) => (
              <div key={log._id} className="bg-gray-50 rounded p-3 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-semibold ${
                    log.operationStatus === 'SUCCESS' ? 'text-green-600' :
                    log.operationStatus === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {log.operationType} - {log.operationStatus}
                  </span>
                  <span className="text-gray-500">
                    {formatDistanceToNow(new Date(log.startedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-gray-600">
                  Processed: {log.tradesProcessed} trades, {log.ordersProcessed} orders
                  {log.dailyPnLCreated > 0 && `, ${log.dailyPnLCreated} P&L summaries`}
                </div>
                {log.triggeredBy && (
                  <div className="text-gray-500 text-xs">
                    By: {log.triggeredBy.name} ({log.triggeredBy.email})
                  </div>
                )}
                {log.errorMessage && (
                  <div className="text-red-600 text-xs mt-1">
                    Error: {log.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}