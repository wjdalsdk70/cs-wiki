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
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            CS Wiki
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색..."
              className="w-full pl-9 pr-3 py-1.5 bg-white/[0.06] text-white/80 rounded-lg text-sm border border-white/[0.08] focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] placeholder-white/20 transition-all"
            />
          </div>
        </form>

      </div>
    </nav>
  )
}
