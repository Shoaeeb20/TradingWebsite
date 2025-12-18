import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">PaperTrade India</h3>
            <p className="text-gray-400 text-sm mb-4">
              Free virtual stock trading platform for learning the Indian stock market. 
              Practice with ₹1,00,000 virtual cash risk-free.
            </p>
            <p className="text-gray-400 text-xs">
              © 2024 PaperTrade India. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/market" className="text-gray-400 hover:text-white transition-colors">Market</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500">
                For educational purposes only. Not real money trading.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Developed by <a href="mailto:osman.shoaeeb@gmail.com" className="text-blue-400 hover:text-blue-300">osman.shoaeeb@gmail.com</a>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Market data provided by Yahoo Finance. All trading is virtual and for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}