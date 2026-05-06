'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="text-white font-bold text-lg shrink-0">
          CS Wiki
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색..."
            className="w-full px-3 py-1.5 bg-gray-800 text-gray-200 rounded-md text-sm border border-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
          />
        </form>

        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link href="/admin/new" className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            + 글쓰기
          </Link>
        </div>
      </div>
    </nav>
  )
}
