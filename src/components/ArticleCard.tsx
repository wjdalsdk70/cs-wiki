import Link from 'next/link'
import type { ArticleWithCategory } from '@/types'

type Props = {
  article: ArticleWithCategory
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/wiki/${article.slug}`}
      className="group block p-4 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200"
    >
      <h3 className="text-white/90 font-medium text-sm leading-snug group-hover:text-white transition-colors">
        {article.title}
      </h3>
      {article.summary && (
        <p className="text-white/35 text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {article.summary}
        </p>
      )}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {article.category && (
          <span className="text-xs px-2 py-0.5 bg-indigo-500/15 text-indigo-300/80 rounded-full border border-indigo-500/20">
            {article.category.icon} {article.category.name}
          </span>
        )}
        {article.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-white/[0.05] text-white/30 rounded-full border border-white/[0.06]">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
