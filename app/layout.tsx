import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PaperTrade India - Free Virtual Stock Trading Platform | Practice NSE Trading',
  description: 'Master Indian stock market with ₹1,00,000 virtual cash. Trade 100+ NSE stocks risk-free. Real market data, intraday & delivery trading, short selling. Start learning today!',
  keywords: ['paper trading India', 'virtual stock trading', 'NSE stocks', 'stock market simulator', 'learn trading', 'practice trading', 'Indian stock market', 'free trading platform', 'stock trading game'],
  authors: [{ name: 'PaperTrade India' }],
  creator: 'PaperTrade India',
  publisher: 'PaperTrade India',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://papertrade-india.vercel.app',
    title: 'PaperTrade India - Free Virtual Stock Trading Platform',
    description: 'Practice trading 100+ NSE stocks with ₹1,00,000 virtual cash. Learn intraday, delivery, and short selling risk-free.',
    siteName: 'PaperTrade India',
    images: [{
      url: '/logo.svg',
      width: 1200,
      height: 630,
      alt: 'PaperTrade India - Virtual Stock Trading',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaperTrade India - Free Virtual Stock Trading',
    description: 'Master Indian stock market with ₹1L virtual cash. Trade 100+ NSE stocks risk-free.',
    images: ['/logo.svg'],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
