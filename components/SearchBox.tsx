'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/market?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/market')
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative flex">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks..."
        className="px-4 py-2 border border-r-0 rounded-l-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors"
      >
        🔍
      </button>
    </form>
  )
}
