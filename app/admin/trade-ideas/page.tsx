'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface TradeIdea {
  _id: string
  title: string
  symbol: string
  type: 'EQUITY' | 'FNO'
  action: 'BUY' | 'SELL'
  entryPrice?: number
  targetPrice?: number
  stopLoss?: number
  quantity?: number
  rationale: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  timeHorizon: 'INTRADAY' | 'SHORT_TERM' | 'MEDIUM_TERM'
  createdAt: string
  expiresAt: string
  isActive: boolean
}

interface PaymentSubmission {
  _id: string
  email: string
  paymentApp: string
  paymentDate: string
  userUpiId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: string
  adminNotes?: string
}

export default function AdminTradeIdeasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'ideas' | 'submissions' | 'create'>('submissions')
  const [tradeIdeas, setTradeIdeas] = useState<TradeIdea[]>([])
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')

  // Form state for creating new trade idea
  const [newIdea, setNewIdea] = useState({
    symbol: '',
    type: 'EQUITY' as 'EQUITY' | 'FNO',
    rationale: '',
    daysToExpire: '7'
  })

  // Check admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.email) {
      const adminEmails = ['admin@papertrade-india.com', 'oshoaeeb@gmail.com']
      if (!adminEmails.includes(session.user.email)) {
        router.push('/dashboard')
      }
    }
  }, [session, status, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, activeTab, statusFilter, searchTerm])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'ideas') {
        const response = await fetch('/api/admin/trade-ideas')
        const data = await response.json()
        if (data.success) {
          setTradeIdeas(data.data.tradeIdeas)
        }
      } else if (activeTab === 'submissions') {
        const params = new URLSearchParams()
        if (statusFilter) params.append('status', statusFilter)
        if (searchTerm) params.append('search', searchTerm)
        
        const response = await fetch(`/api/admin/payment-submissions?${params}`)
        const data = await response.json()
        if (data.success) {
          setSubmissions(data.data.submissions)
        }
      }
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePayment = async (submissionId: string, adminNotes: string = '') => {
    try {
      const response = await fetch(`/api/admin/payment-submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes })
      })

      const data = await response.json()
      if (data.success) {
        // Remove from current list instead of refetching
        setSubmissions(prev => prev.filter(sub => sub._id !== submissionId))
        alert('Payment approved and subscription activated!')
      } else {
        alert(data.error || 'Failed to approve payment')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleRejectPayment = async (submissionId: string, adminNotes: string = '') => {
    try {
      const response = await fetch(`/api/admin/payment-submissions/${submissionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes })
      })

      const data = await response.json()
      if (data.success) {
        // Remove from current list instead of refetching
        setSubmissions(prev => prev.filter(sub => sub._id !== submissionId))
        alert('Payment rejected')
      } else {
        alert(data.error || 'Failed to reject payment')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newIdea.rationale.trim()) {
      alert('Please enter the trade message')
      return
    }
    
    try {
      const response = await fetch('/api/admin/trade-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newIdea.symbol || 'Trade Idea',
          symbol: newIdea.symbol || 'GENERAL',
          type: newIdea.type,
          action: 'BUY', // Default action
          rationale: newIdea.rationale,
          riskLevel: 'MEDIUM', // Default risk level
          timeHorizon: 'SHORT_TERM', // Default time horizon
          daysToExpire: parseInt(newIdea.daysToExpire)
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Trade idea posted successfully!')
        setNewIdea({
          symbol: '',
          type: 'EQUITY',
          rationale: '',
          daysToExpire: '7'
        })
        setActiveTab('ideas')
      } else {
        alert(data.error || 'Failed to create trade idea')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Trade Ideas Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage subscriptions and trade ideas</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment Submissions
              </button>
              <button
                onClick={() => setActiveTab('ideas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ideas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Trade Ideas
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create New Idea
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Payment Submissions Tab */}
            {activeTab === 'submissions' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Submissions</h2>
                  
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Search by email or UPI ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Pending Only</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {statusFilter === 'PENDING' ? 'No Pending Submissions' : 'No Submissions Found'}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Try adjusting your search terms.' : 'New payment submissions will appear here.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{submission.email}</h3>
                            <p className="text-sm text-gray-600">Payment App: {submission.paymentApp}</p>
                            <p className="text-sm text-gray-600">Payment Date: {new Date(submission.paymentDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">UPI ID: <span className="font-mono">{submission.userUpiId}</span></p>
                            <p className="text-sm text-gray-600">Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
                          </div>
                          <div>
                            <div className="mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                submission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                submission.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {submission.status}
                              </span>
                            </div>
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">
                                <strong>Contact:</strong> WhatsApp verification required<br />
                                <span className="text-xs text-gray-500">
                                  (User should send screenshot here)
                                </span>
                              </p>
                            </div>
                            {submission.status === 'PENDING' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprovePayment(submission._id)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPayment(submission._id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trade Ideas Tab */}
            {activeTab === 'ideas' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Trade Ideas</h2>
                {tradeIdeas.length === 0 ? (
                  <p className="text-gray-600">No trade ideas found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tradeIdeas.map((idea) => (
                      <div key={idea._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            idea.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {idea.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">{idea.symbol}</p>
                        <p className="text-sm text-gray-600">{idea.type} • {idea.action}</p>
                        <p className="text-sm text-gray-600 mt-2">{idea.rationale}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Created: {new Date(idea.createdAt).toLocaleDateString()}</p>
                          <p>Expires: {new Date(idea.expiresAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create New Idea Tab */}
            {activeTab === 'create' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Post New Trade Idea</h2>
                <form onSubmit={handleCreateIdea} className="space-y-6 max-w-4xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trade Message *
                    </label>
                    <textarea
                      value={newIdea.rationale}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, rationale: e.target.value }))}
                      required
                      rows={12}
                      placeholder="Paste your complete trade message here...

Example:
POSITIONAL TRADE
APOLLO Hospital Looks Good above 7110
SL 7050
TARGETS 30-50-70-80-100 points
Hold few days
Please consult your financial advisor before investing
All research for educational purposes only.
Reversal from bottom, RSI is shifting in upper direction. Stock is ready to cross past barriers with good volumes. Breakout after long consolidation."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Just paste your complete trading message. It will be displayed exactly as you type it to subscribers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Symbol (Optional)</label>
                      <input
                        type="text"
                        value={newIdea.symbol}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                        placeholder="e.g., APOLLOHOSP"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={newIdea.type}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, type: e.target.value as 'EQUITY' | 'FNO' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="EQUITY">Equity</option>
                        <option value="FNO">F&O</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Days to Expire</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={newIdea.daysToExpire}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, daysToExpire: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                  >
                    Post Trade Idea
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}