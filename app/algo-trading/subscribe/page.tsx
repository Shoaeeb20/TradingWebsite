'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AlgoTradingSubscribePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    upiId: '',
    acknowledgment: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // UPI Payment Details
  const upiId = 'oshoaeeb@oksbi'
  const merchantName = 'Shoaeeb Osman'
  const amount = 199

  // Generate UPI URL for QR code
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Algo Trading Pro Subscription')}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/algo-trading/subscribe')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.acknowledgment) {
      setError('Please acknowledge the terms and conditions')
      return
    }

    if (!formData.upiId.trim()) {
      setError('Please enter your UPI ID')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payment-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentApp: 'GOOGLE_PAY', // Required field
          paymentDate: new Date().toISOString(), // Current date
          userUpiId: formData.upiId.trim(),
          subscriptionType: 'ALGO_TRADING',
          amount: 199
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to submit payment details')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Details Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your payment details have been submitted for verification. You will receive WhatsApp confirmation within 24 hours.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/algo-trading')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Algo Trading
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🤖 Algorithmic Trading Pro Subscription
          </h1>
          <p className="text-lg text-gray-600">
            Advanced paper trading with automated Moving Average Crossover strategy
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">₹199</div>
            <div className="text-gray-600">per month</div>
            <div className="text-sm text-gray-500 mt-2">
              Educational algorithmic trading simulation
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">🎯 What You Get:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Moving Average Crossover Strategy
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Automated Paper Trading Execution
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Real-time Signal Generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Performance Analytics & Tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Market Hours Safety Controls
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Educational Learning Resources
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">📚 Educational Focus:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">📖</span>
                  Learn algorithmic trading concepts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">📊</span>
                  Understand moving average strategies
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">🎮</span>
                  Practice with virtual money only
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">📈</span>
                  Analyze strategy performance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">🛡️</span>
                  Risk-free learning environment
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">💳 Payment Process</h3>
            
            {/* QR Code */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="mb-4">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code for Payment"
                      className="mx-auto border rounded-lg bg-white"
                      width={200}
                      height={200}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>UPI ID:</strong> {upiId}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Merchant:</strong> {merchantName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Amount:</strong> ₹{amount}
                  </p>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">📱 Payment Steps:</h4>
                  <ol className="text-sm text-blue-800 space-y-2">
                    <li><strong>1.</strong> Scan QR code or use UPI ID: {upiId}</li>
                    <li><strong>2.</strong> Pay exactly ₹{amount}</li>
                    <li><strong>3.</strong> Take screenshot of payment</li>
                    <li><strong>4.</strong> Send to WhatsApp: 9330255340</li>
                    <li><strong>5.</strong> Submit your UPI ID below</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your UPI ID (for verification)
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="yourname@paytm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Acknowledgment */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.acknowledgment}
                    onChange={(e) => setFormData({ ...formData, acknowledgment: e.target.checked })}
                    className="mt-1"
                    required
                  />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-2">⚠️ Important Acknowledgment:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• This is an educational paper trading simulation only</li>
                      <li>• No real money trading or investment advice provided</li>
                      <li>• All trades are virtual and for learning purposes</li>
                      <li>• Past performance does not guarantee future results</li>
                      <li>• Platform is not SEBI registered - educational use only</li>
                      <li>• Subscription is for educational content access only</li>
                    </ul>
                  </div>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.acknowledgment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Payment Details'}
              </button>
            </form>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-900 mb-3">🚨 Legal Disclaimers</h3>
          <div className="text-sm text-red-800 space-y-2">
            <p><strong>Educational Purpose Only:</strong> This algorithmic trading feature is designed purely for educational and learning purposes.</p>
            <p><strong>No Real Trading:</strong> All trades executed are simulated with virtual money. No real financial transactions occur.</p>
            <p><strong>Not Investment Advice:</strong> The strategies, signals, and content provided are for educational purposes only and do not constitute investment advice.</p>
            <p><strong>No Guarantees:</strong> Past performance of strategies does not guarantee future results. All trading involves risk.</p>
            <p><strong>SEBI Compliance:</strong> This platform is not registered with SEBI and does not provide regulated financial services.</p>
            <p><strong>Learning Tool:</strong> Use this as a learning tool to understand algorithmic trading concepts in a risk-free environment.</p>
          </div>
        </div>
      </div>
    </div>
  )
}