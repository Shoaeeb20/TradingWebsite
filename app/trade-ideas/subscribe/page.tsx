'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface SubscriptionStatus {
  isActive: boolean
  status: string
  expiresAt?: string
  daysRemaining?: number
}

export default function SubscribePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    paymentApp: '',
    paymentDate: '',
    userUpiId: ''
  })
  const [acknowledgeTerms, setAcknowledgeTerms] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/trade-ideas/subscribe')
    }
  }, [status, router])

  // Check subscription status
  useEffect(() => {
    if (session) {
      checkSubscriptionStatus()
    }
  }, [session])

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription/status')
      const data = await response.json()
      
      if (data.success) {
        setSubscriptionStatus(data.data)
        // If user has active subscription, redirect to educational market studies
        if (data.data.isActive) {
          router.push('/trade-ideas')
        }
      }
    } catch (err) {
      console.error('Error checking subscription:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.paymentApp || !formData.paymentDate || !formData.userUpiId) {
      setError('All fields are required')
      return
    }

    if (!acknowledgeTerms) {
      setError('Please acknowledge that you understand this platform provides only educational content')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/payment-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setFormData({
          paymentApp: '',
          paymentDate: '',
          userUpiId: ''
        })
        setAcknowledgeTerms(false)
      } else {
        setError(data.error || 'Failed to submit payment')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show pending status if user has pending submission
  if (subscriptionStatus?.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-yellow-500 text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Under Review</h2>
          <p className="text-gray-600 mb-6">
            Your payment submission is being reviewed. You will receive access within 24-48 hours after approval.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong><br />
              Our team will verify your payment via WhatsApp and activate your subscription once confirmed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Details Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your payment details have been submitted. Now please send your payment screenshot to WhatsApp for verification.
          </p>
          
          {/* WhatsApp Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="text-green-600 text-4xl">📱</div>
            </div>
            <h3 className="font-bold text-green-800 mb-3">Next Step: Send Screenshot</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/919330255340?text=Hi%2C%20I%20have%20made%20payment%20for%20Educational%20Market%20Studies%20subscription.%20Please%20find%20my%20payment%20screenshot."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                📱 Send Screenshot on WhatsApp
              </a>
              <p className="text-sm text-green-700">
                <strong>WhatsApp:</strong> +91 9330255340
              </p>
              <p className="text-xs text-green-600">
                Click the button above to open WhatsApp with a pre-filled message
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>⏱️ Approval takes 24-48 hours</strong><br />
              After we receive your screenshot, we'll verify and activate your subscription.
            </p>
          </div>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legal Disclaimer - Top of Page */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">⚠️ Legal Disclaimer</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  <strong>This platform is not SEBI registered.</strong> All educational market studies are strictly for paper trading and educational purposes only. 
                  No real-money trading or investment advice is provided.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscribe to Educational Market Studies</h1>
          <p className="text-gray-600 mt-2">Access comprehensive market observations and educational content for paper trading practice</p>
          <div className="text-2xl font-bold text-blue-600 mt-4">₹39/month</div>
          <p className="text-sm text-gray-500 mt-1">Less than ₹1.30 per day for premium educational market analysis!</p>
        </div>

        {/* Value Proposition Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">🎯 What You'll Access</h2>
            <p className="text-gray-600">Professional market observations to enhance your paper trading education</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold text-gray-900 mb-2">Daily Market Studies</h3>
              <p className="text-sm text-gray-600">Fresh educational market observations posted regularly with detailed technical analysis</p>
            </div>
           
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibent text-gray-900 mb-2">Technical Analysis</h3>
              <p className="text-sm text-gray-600">Detailed educational rationale behind each market observation with learning insights</p>
            </div>
          </div>

          {/* Sample Trade Ideas Preview */}
          <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Sample Educational Market Studies (What Subscribers Access)</h3>
            
            <div className="space-y-4">
              {/* Sample Idea 1 */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">POSITIONAL MARKET STUDY – EDUCATIONAL (Paper Trading Only)</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">EQUITY</span>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
Instrument: RELIANCE

Purpose of this post: This is a simple market study shared only for learning and paper trading. It is not investment advice.

What is happening in simple words:
The stock has been moving sideways for a while and now looks ready to break higher
The price area around 2850 is acting like a strong support level
More buyers seem to be coming in at lower prices

What this means (for learning):
If the stock stays strong above the 2850 area and overall market conditions remain good, we may see gradual upward movement over the next few weeks.

Small upward price movements (for example, 50–150 points from current levels) are being observed only as learning reference, not as guaranteed outcomes.

Why this study is shared:
• Price breaking out → stock trying to move higher after long wait
• RSI moving up → momentum may be improving
• Good volume → more people are buying and selling
• Support holding → the 2850 level is acting like a floor

Important to understand:
• Markets can move up or down at any time
• This is not a prediction
• This is only to help beginners understand how traders read charts

Educational Disclaimer: This content does not constitute investment advice or a recommendation to buy or sell any security. This market observation is shared solely for learning, analysis, and paper trading practice. Users are responsible for their own financial decisions and should consult qualified financial advisors.
                </pre>
              </div>

              {/* Sample Idea 2 */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">INTRADAY MARKET STUDY – EDUCATIONAL (Paper Trading Only)</h4>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">F&O</span>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
Instrument: NIFTY 22000 CE

Purpose of this post: This is a simple options study shared only for learning and paper trading. It is not investment advice.

What is happening in simple words:
The Nifty index is showing strength and moving higher
The 22000 call option premium is around 45 and may move up
Big institutions seem to be buying rather than selling

What this means (for learning):
If Nifty continues to stay strong and moves higher during the day, this call option premium may increase from current levels.

Small premium increases (for example, from 45 to 55-65) are being observed only as learning reference, not as guaranteed outcomes.

Why this study is shared:
• Nifty staying strong → index showing upward momentum
• Less call writing → big players not selling calls aggressively
• Banking stocks up → important sector supporting the index
• FII buying → foreign investors showing positive interest

Important to understand:
• Options can lose value very quickly
• This is not a prediction
• This is only to help beginners understand how options work

Educational Disclaimer: This content does not constitute investment advice or a recommendation to buy or sell any security. This market observation is shared solely for learning, analysis, and paper trading practice. Users are responsible for their own financial decisions and should consult qualified financial advisors.
                </pre>
              </div>

              {/* Sample Idea 3 */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">SWING MARKET STUDY – EDUCATIONAL (Paper Trading Only)</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">EQUITY</span>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
Instrument: TCS

Purpose of this post: This is a simple swing trading study shared only for learning and paper trading. It is not investment advice.

What is happening in simple words:
TCS stock has come down and is now finding support around 3650-3680 levels
The company's business seems to be doing well
The stock looks like it might bounce back from these lower levels

What this means (for learning):
If TCS stays strong above the 3650 area and company results remain good, we may see gradual upward movement over the next few weeks.

Small upward price movements (for example, 100–250 points from current levels) are being observed only as learning reference, not as guaranteed outcomes.

Why this study is shared:
• Support holding → the 3650 level is acting like a floor
• Good results expected → company business seems healthy
• Dollar earnings strong → TCS makes money in dollars which is good
• Stock looks cheap → compared to other IT companies, price seems reasonable
• Bounce pattern → technical charts suggest possible upward move

Important to understand:
• Markets can move up or down at any time
• Company results can be different than expected
• This is only to help beginners understand swing trading concepts

Educational Disclaimer: This content does not constitute investment advice or a recommendation to buy or sell any security. This market observation is shared solely for learning, analysis, and paper trading practice. Users are responsible for their own financial decisions and should consult qualified financial advisors.
                </pre>
              </div>

              {/* Sample Idea 4 - QUADFUTURE */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">FUTURES MARKET STUDY – EDUCATIONAL (Paper Trading Only)</h4>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">FUTURES</span>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
Instrument: QUADFUTURE

Purpose of this post: This is a simple market study shared only for learning and paper trading. It is not investment advice.

What is happening in simple words:
The price has stopped falling and is now trying to move up
The area around 317 is acting like an important level
Buyers seem to be slowly coming back into the stock

What this means (for learning):
If the price stays strong above the 317 area and overall market conditions remain supportive, the stock may show gradual upward movement over the next few weeks.

Small upward price movements (for example, 10–40 points from current levels) are being observed only as learning reference, not as guaranteed outcomes.

Why this study is shared:
• RSI moving up → momentum may be improving
• Good volume → more market participation is visible
• Long consolidation → the stock rested for a long time before trying to move
• Reversal signs → price behavior suggests a possible change in direction

Important to understand:
• Markets can move up or down at any time
• This is not a prediction
• This is only to help beginners understand how traders read charts

Educational Disclaimer: This content does not constitute investment advice or a recommendation to buy or sell any security. This market observation is shared solely for learning, analysis, and paper trading practice. Users are responsible for their own financial decisions and should consult qualified financial advisors.
                </pre>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>💡 This is just a preview!</strong> Subscribers get 3-5 fresh educational market studies like these every working day, 
                plus real-time market analysis and technical observations for paper trading practice and learning.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">💳 Quick Payment Process</h2>
            
            {/* UPI QR Code */}
            <div className="text-center mb-6">
              <div className="bg-gray-100 rounded-lg p-6 mb-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block">
                  {/* QR Code using QR Server API */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=oshoaeeb@oksbi%26pn=Shoaeeb%2520Osman%26am=39%26cu=INR`}
                    alt="UPI QR Code for Payment"
                    className="w-64 h-64"
                    onError={(e) => {
                      // Fallback if QR code fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback content */}
                  <div className="w-64 h-64 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg" style={{display: 'none'}}>
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-sm text-gray-600 text-center px-4">
                      QR Code not loading?<br />
                      Use UPI ID: <strong>oshoaeeb@oksbi</strong><br />
                      Amount: <strong>₹39</strong>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">Scan this QR code with Google Pay or PhonePe</p>
                <p className="text-xs text-gray-500 mt-2">
                  If QR code doesn't work, manually enter UPI ID: <strong>oshoaeeb@oksbi</strong>
                </p>
              </div>
              
              {/* Payment Details */}
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">UPI ID:</span>
                    <span className="font-mono text-blue-900 select-all">oshoaeeb@oksbi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Merchant:</span>
                    <span className="text-blue-900">Shoaeeb Osman</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Amount:</span>
                    <span className="font-bold text-blue-900">₹39</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Accepted Apps:</span>
                    <span className="text-blue-900">Google Pay, PhonePe only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Simple 4-Step Process:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-sm text-gray-700">Scan QR code with Google Pay or PhonePe</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-sm text-gray-700">Pay exactly ₹39 to oshoaeeb@oksbi</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-sm text-gray-700">Fill the form with payment details</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <p className="text-sm text-gray-700">Send payment screenshot to WhatsApp +91 9330255340</p>
                </div>
              </div>

              {/* Success Stories */}
              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🌟 What Our Subscribers Say</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>"Helped me understand market structure better"</strong> - Enhanced my understanding of market patterns and technical analysis</p>
                  <p><strong>"Excellent educational content"</strong> - Clear observations make paper trading practice more effective</p>
                  <p><strong>"Professional market analysis"</strong> - Detailed educational rationale behind each market observation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Details Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Payment Details</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (pre-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              {/* Payment App */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment App Used *
                </label>
                <select
                  name="paymentApp"
                  value={formData.paymentApp}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select payment app</option>
                  <option value="GOOGLE_PAY">Google Pay</option>
                  <option value="PHONEPE">PhonePe</option>
                </select>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* User UPI ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your UPI ID *
                </label>
                <input
                  type="text"
                  name="userUpiId"
                  value={formData.userUpiId}
                  onChange={handleInputChange}
                  placeholder="yourname@paytm"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* WhatsApp Instructions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">📱 After Submitting</h4>
                <p className="text-sm text-green-700 mb-3">
                  Send your payment screenshot to WhatsApp: <strong>+91 9330255340</strong>
                </p>
                <a
                  href="https://wa.me/919330255340?text=Hi%2C%20I%20have%20made%20payment%20for%20Educational%20Market%20Studies%20subscription.%20Please%20find%20my%20payment%20screenshot."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  <span>📱</span>
                  Open WhatsApp Chat
                </a>
              </div>

              {/* Acknowledgment Checkbox */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgeTerms}
                    onChange={(e) => setAcknowledgeTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-blue-800">
                    <strong>☐ I understand</strong> this platform provides only educational content for paper trading and does not offer investment advice or real-money trading recommendations.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !acknowledgeTerms}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? 'Submitting...' : 'Submit Payment Details'}
              </button>
            </form>

            {/* Important Notes */}
            <div className="mt-6 space-y-4">
              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🚀 Why Subscribe Now?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Get 3-5 fresh trade ideas every week</li>
                  <li>• Detailed technical analysis with each suggestion</li>
                  <li>• Clear entry, target, and stop-loss levels</li>
                  <li>• Both equity and F&O opportunities covered</li>
                  <li>• Perfect for improving your paper trading skills</li>
                </ul>
              </div> */}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⏱️ Quick Approval Process</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Submit form first, then send screenshot to WhatsApp</li>
                  <li>• Approval takes 24-48 hours after screenshot verification</li>
                  <li>• WhatsApp: +91 9330255340</li>
                  <li>• Access valid for 30 days after approval</li>
                  <li>• Only Google Pay and PhonePe payments accepted</li>
                </ul>
              </div>

              {/* Legal Disclaimer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Legal Disclaimer</h4>
                <p className="text-sm text-red-700">
                  <strong>This platform is not SEBI registered.</strong> All educational market studies are strictly for paper trading and educational purposes only. 
                  No real-money trading or investment advice is provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}