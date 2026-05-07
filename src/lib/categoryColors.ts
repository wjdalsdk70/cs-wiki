const palette: Record<string, { gradient: string; border: string; glow: string }> = {
  'data-structures':       { gradient: 'from-sky-500/14 to-cyan-400/7',       border: 'border-sky-300/20',    glow: 'group-hover:shadow-sky-500/12' },
  algorithms:              { gradient: 'from-fuchsia-500/12 to-rose-400/7',   border: 'border-fuchsia-300/18', glow: 'group-hover:shadow-fuchsia-500/10' },
  'operating-systems':     { gradient: 'from-amber-500/13 to-orange-400/7',   border: 'border-amber-300/20',   glow: 'group-hover:shadow-amber-500/10' },
  networks:                { gradient: 'from-emerald-500/13 to-teal-400/7',   border: 'border-emerald-300/20', glow: 'group-hover:shadow-emerald-500/10' },
  databases:               { gradient: 'from-rose-500/12 to-pink-400/7',      border: 'border-rose-300/18',    glow: 'group-hover:shadow-rose-500/10' },
  'computer-architecture': { gradient: 'from-lime-500/12 to-yellow-400/7',    border: 'border-lime-300/18',    glow: 'group-hover:shadow-lime-500/10' },
  'languages-compilers':   { gradient: 'from-blue-500/13 to-indigo-400/7',    border: 'border-blue-300/18',    glow: 'group-hover:shadow-blue-500/10' },
  security:                { gradient: 'from-red-500/12 to-amber-400/7',      border: 'border-red-300/18',     glow: 'group-hover:shadow-red-500/10' },
}

const fallback = { gradient: 'from-slate-500/12 to-zinc-400/6', border: 'border-slate-300/18', glow: 'group-hover:shadow-slate-500/10' }

export function getCategoryColors(slug: string) {
  return palette[slug] ?? fallback
}
