'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const current = document.documentElement.dataset.theme
  if (current === 'light' || current === 'dark') return current
  const saved = window.localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
      title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.06] text-white/55 transition-colors hover:bg-white/[0.1] hover:text-white/80"
    >
      {theme === 'dark' ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.5M12 18.5V21M4.03 4.03l1.77 1.77M18.2 18.2l1.77 1.77M3 12h2.5M18.5 12H21M4.03 19.97 5.8 18.2M18.2 5.8l1.77-1.77M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.3A8.5 8.5 0 1 1 10.7 3 6.5 6.5 0 0 0 21 13.3z" />
        </svg>
      )}
    </button>
  )
}
