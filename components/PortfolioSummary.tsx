'use client'

import { useEffect, useState } from 'react'
import TopUpModal from './TopUpModal'

interface Holding {
  symbol: string
  quantity: number
  avgPrice: number
}

interface PortfolioSummaryProps {
  balance: number
  fnoBalance: number
  holdings: Holding[]
}

export default function PortfolioSummary({ balance, fnoBalance, holdings }: PortfolioSummaryProps) {
  const [totalValue, setTotalValue] = useState(balance)
  const [pnl, setPnl] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentBalance, setCurrentBalance] = useState(balance)
  const [currentFnoBalance, setCurrentFnoBalance] = useState(fnoBalance)
  const [topUpModal, setTopUpModal] = useState<{ isOpen: boolean; type: 'EQUITY' | 'FNO' }>({ isOpen: false, type: 'EQUITY' })

  const handleBalanceUpdate = (newBalances: { balance: number; fnoBalance: number }) => {
    setCurrentBalance(newBalances.balance)
    setCurrentFnoBalance(newBalances.fnoBalance)
  }

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true)
      let holdingsValue = 0
      let totalPnl = 0

      for (const holding of holdings) {
        try {
          const res = await fetch(`/api/stocks/price?symbol=${holding.symbol}`)
          const data = await res.json()
          if (data.price) {
            // Universal P&L formula: (currentPrice - avgPrice) × quantity
            const positionPnl = (data.price - holding.avgPrice) * holding.quantity
            totalPnl += positionPnl
            
            // Holdings value for portfolio calculation
            holdingsValue += data.price * holding.quantity
          }
        } catch (error) {
          console.error(`Failed to fetch price for ${holding.symbol}`)
        }
      }

      const totalPortfolioValue = currentBalance + currentFnoBalance + holdingsValue
      setTotalValue(totalPortfolioValue)
      setPnl(totalPnl)
      setLoading(false)
    }

    if (holdings.length > 0) {
      fetchPrices()
      
      // Auto-refresh prices every 2 minutes
      const interval = setInterval(fetchPrices, 2 * 60 * 1000)
      return () => clearInterval(interval)
    } else {
      setTotalValue(currentBalance + currentFnoBalance)
      setLoading(false)
    }
  }, [holdings, currentBalance, currentFnoBalance])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-600">Total Portfolio Value</div>
          {loading ? (
            <div className="h-9 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <div className="text-3xl font-bold text-primary">
              ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        <div className="card">
          <div className="text-sm text-gray-600">Equity Balance</div>
          <div className="text-2xl font-bold mb-2">
            ₹{currentBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <button
            onClick={() => setTopUpModal({ isOpen: true, type: 'EQUITY' })}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            + Add Money
          </button>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600">F&O Balance</div>
          <div className="text-2xl font-bold mb-2">
            ₹{currentFnoBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <button
            onClick={() => setTopUpModal({ isOpen: true, type: 'FNO' })}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            + Add Money
          </button>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600">Total P&L</div>
          {loading ? (
            <div className="h-9 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <div className={`text-2xl font-bold ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
              {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </div>
      
      <TopUpModal
        isOpen={topUpModal.isOpen}
        onClose={() => setTopUpModal({ ...topUpModal, isOpen: false })}
        balanceType={topUpModal.type}
        onSuccess={handleBalanceUpdate}
      />
    </>
  )
}
