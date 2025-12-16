'use client'

import { useState, useEffect } from 'react'

interface User {
  name: string
  email: string
  balance: number
  holdingsValue: number
  totalValue: number
  rank: number
}

interface LeaderboardResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function LeaderboardTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  // Fetch leaderboard data
  const fetchLeaderboard = async (page: number, search: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })
      
      const response = await fetch(`/api/leaderboard?${params}`)
      const data: LeaderboardResponse = await response.json()
      
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchLeaderboard(1, '')
  }, [])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchLeaderboard(1, searchTerm)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchLeaderboard(newPage, searchTerm)
  }

  return (
    <div className="card">
      {/* Search Box */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <span className="text-sm text-gray-600">
            {pagination.total} {pagination.total === 1 ? 'trader' : 'traders'}
          </span>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading leaderboard...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Rank</th>
                <th className="text-left py-3">Name</th>
                <th className="text-right py-3">Cash</th>
                <th className="text-right py-3">Holdings</th>
                <th className="text-right py-3">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? `No traders found matching "${searchTerm}"` : 'No traders found'}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.email} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <span className="font-bold text-lg">#{user.rank}</span>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="text-right">₹{user.balance.toLocaleString('en-IN')}</td>
                    <td className="text-right">₹{user.holdingsValue.toLocaleString('en-IN')}</td>
                    <td className="text-right font-bold text-primary">
                      ₹{user.totalValue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 text-sm bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <span className="text-xs text-gray-500">
              ({((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, pagination.total)} of {pagination.total})
            </span>
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 text-sm bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
