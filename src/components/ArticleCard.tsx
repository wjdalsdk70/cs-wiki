import Link from 'next/link'
import type { ArticleWithCategory } from '@/types'

type Props = {
  article: ArticleWithCategory
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/wiki/${article.slug}`}
      className="block p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group"
    >
      <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
        {article.title}
      </h3>
      {article.summary && (
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{article.summary}</p>
      )}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
          {article.category?.icon} {article.category?.name}
        </span>
        {article.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-900 text-gray-400 rounded border border-gray-700">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
