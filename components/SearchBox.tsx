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
    <form onSubmit={handleSearch} className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks..."
        className="px-4 py-2 border rounded-lg w-64"
      />
    </form>
  )
}
