import Link from 'next/link'
import type { Category } from '@/types'

type Props = {
  category: Category
  articleCount?: number
}

export default function CategoryCard({ category, articleCount }: Props) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="block p-5 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group"
    >
      <div className="flex items-start gap-3">
        {category.icon && (
          <span className="text-2xl">{category.icon}</span>
        )}
        <div>
          <h2 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              {category.description}
            </p>
          )}
          {articleCount !== undefined && (
            <p className="text-gray-500 text-xs mt-2">{articleCount}개 문서</p>
          )}
        </div>
      </div>
    </Link>
  )
}
