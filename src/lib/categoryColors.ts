const palette: Record<string, { gradient: string; border: string; glow: string }> = {
  'data-structures':      { gradient: 'from-blue-600/20 to-cyan-600/10',    border: 'border-blue-500/30',   glow: 'group-hover:shadow-blue-500/20' },
  'algorithms':           { gradient: 'from-violet-600/20 to-purple-600/10', border: 'border-violet-500/30', glow: 'group-hover:shadow-violet-500/20' },
  'operating-systems':    { gradient: 'from-orange-600/20 to-amber-600/10',  border: 'border-orange-500/30', glow: 'group-hover:shadow-orange-500/20' },
  'networks':             { gradient: 'from-teal-600/20 to-green-600/10',    border: 'border-teal-500/30',   glow: 'group-hover:shadow-teal-500/20' },
  'databases':            { gradient: 'from-pink-600/20 to-rose-600/10',     border: 'border-pink-500/30',   glow: 'group-hover:shadow-pink-500/20' },
  'computer-architecture':{ gradient: 'from-yellow-600/20 to-lime-600/10',   border: 'border-yellow-500/30', glow: 'group-hover:shadow-yellow-500/20' },
  'languages-compilers':  { gradient: 'from-indigo-600/20 to-blue-600/10',   border: 'border-indigo-500/30', glow: 'group-hover:shadow-indigo-500/20' },
  'security':             { gradient: 'from-red-600/20 to-orange-600/10',    border: 'border-red-500/30',    glow: 'group-hover:shadow-red-500/20' },
}

const fallback = { gradient: 'from-slate-600/20 to-slate-700/10', border: 'border-slate-500/30', glow: 'group-hover:shadow-slate-500/20' }

export function getCategoryColors(slug: string) {
  return palette[slug] ?? fallback
}
