'use client'

import { useState } from 'react'

export default function SquareOffButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSquareOff = async () => {
    if (!confirm('Are you sure you want to square off all intraday positions? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/square-off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        // Refresh the page to show updated portfolio
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setMessage(data.error || 'Failed to square off positions')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleSquareOff}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {isLoading ? 'Squaring Off...' : 'Square Off Intraday'}
      </button>
      
      {message && (
        <div className={`mt-2 text-sm max-w-xs text-right ${
          message.includes('Successfully') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}