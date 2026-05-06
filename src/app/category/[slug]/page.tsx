import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ArticleWithCategory } from '@/types'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const { data: articles } = await supabase
    .from('articles')
    .select('*, category:categories(*)')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
          ← 전체 카테고리
        </Link>
        <div className="flex items-center gap-3 mt-3">
          {category.icon && <span className="text-3xl">{category.icon}</span>}
          <div>
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="text-gray-400 mt-1">{category.description}</p>
            )}
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">{articles?.length ?? 0}개 문서</p>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(articles as ArticleWithCategory[]).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>아직 문서가 없습니다.</p>
          <Link href="/admin/new" className="mt-3 inline-block text-blue-400 hover:underline">
            첫 문서 작성하기 →
          </Link>
        </div>
      )}
    </div>
  )
}
