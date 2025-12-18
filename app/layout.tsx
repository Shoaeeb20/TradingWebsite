import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:
    'PaperTrade India – Free Stock Market Simulator | NSE Paper Trading with ₹1,00,000 Virtual Cash',
  description:
    'PaperTrade India is a free stock market simulator for NSE traders. Practice intraday & delivery trading using ₹1,00,000 virtual cash, real market data, live charts, auto square-off, holdings, P&L, and leaderboard. Perfect for beginners learning the Indian stock market.',
  keywords: [
    'best free paper trading website for indian stock market',
    'practice trading stocks india',
    'stock simulator india',
    'paper trading india',
    'nse paper trading',
    'virtual stock trading',
    'free paper trading',
    'NSE stocks',
    'stock market simulator',
    'learn trading',
    'practice trading',
    'Indian stock market',
    'free trading platform',
    'stock trading game',
    'intraday trading',
    'delivery trading',
  ],
  authors: [{ name: 'PaperTrade India' }],
  creator: 'PaperTrade India',
  publisher: 'PaperTrade India',
  robots: 'index, follow',
  verification: {
    google: 'google0824e4c5c0ef59da',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://papertrade-india.vercel.app',
    title: 'PaperTrade India – Free Stock Market Simulator | NSE Paper Trading',
    description:
      'PaperTrade India is a free stock market simulator for NSE traders. Practice intraday & delivery trading using ₹1,00,000 virtual cash, real market data, live charts, auto square-off, holdings, P&L, and leaderboard.',
    siteName: 'PaperTrade India',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'PaperTrade India - Virtual Stock Trading',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaperTrade India - Free Virtual Stock Trading',
    description:
      'Master Indian stock market with ₹1L virtual cash. Trade 100+ NSE stocks risk-free.',
    images: ['/logo.svg'],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953904112923612"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
