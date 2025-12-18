import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - PaperTrade India',
  description: 'Get in touch with PaperTrade India team for support, feedback, or questions',
}

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            We're here to help! Whether you have questions about our platform, need technical support, or want to provide feedback, we'd love to hear from you.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-gray-600 mb-2">For general inquiries and support</p>
                <a href="mailto:osman.shoaeeb@gmail.com" className="text-blue-600 hover:underline">
                  osman.shoaeeb@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-gray-600">We typically respond within 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-gray-600">India (IST Timezone)</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Is PaperTrade India really free?</h3>
              <p className="text-gray-600 text-sm">Yes, completely free! No hidden charges, no premium plans. We believe in making trading education accessible to everyone.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Can I withdraw virtual profits?</h3>
              <p className="text-gray-600 text-sm">No, this is a simulation platform. All money is virtual and cannot be withdrawn. It's for educational purposes only.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">How accurate is the market data?</h3>
              <p className="text-gray-600 text-sm">We use real NSE stock prices with minimal delays. The data is very close to actual market conditions.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Can I reset my portfolio?</h3>
              <p className="text-gray-600 text-sm">Currently, portfolio reset is not available. This encourages learning from mistakes, just like real trading.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What are the trading hours?</h3>
              <p className="text-gray-600 text-sm">We follow NSE trading hours: 9:15 AM to 3:30 PM IST, Monday to Friday (excluding holidays).</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">How do I report a bug?</h3>
              <p className="text-gray-600 text-sm">Please email us with detailed information about the issue, including screenshots if possible.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Need Help Getting Started?</h2>
        <p className="text-gray-600 mb-6">
          New to trading? Check out our platform features and start your risk-free trading journey today!
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/about" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Learn More
          </a>
          <a href="/auth/signin" className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Start Trading
          </a>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2024 PaperTrade India. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a> • 
          <a href="/terms-of-service" className="hover:underline ml-1">Terms of Service</a>
        </p>
      </div>
    </div>
  )
}