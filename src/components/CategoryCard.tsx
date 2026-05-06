import Link from 'next/link'
import type { Category } from '@/types'
import { getCategoryColors } from '@/lib/categoryColors'

type Props = {
  category: Category
  articleCount?: number
}

export default function CategoryCard({ category, articleCount }: Props) {
  const colors = getCategoryColors(category.slug)

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group block p-5 rounded-xl border bg-gradient-to-br ${colors.gradient} ${colors.border} hover:border-opacity-60 transition-all duration-300 hover:shadow-xl ${colors.glow}`}
    >
      <div className="flex items-start gap-3">
        {category.icon && (
          <span className="text-2xl leading-none mt-0.5">{category.icon}</span>
        )}
        <div className="min-w-0">
          <h2 className="text-white font-semibold text-sm truncate group-hover:text-white/90">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-white/40 text-xs mt-1.5 leading-relaxed line-clamp-2">
              {category.description}
            </p>
          )}
          {articleCount !== undefined && (
            <p className="text-white/30 text-xs mt-2.5 font-medium">{articleCount}개 문서</p>
          )}
        </div>
      </div>
    </Link>
  )
}
