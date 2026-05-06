import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ArticleWithCategory } from '@/types'
import { getCategoryColors } from '@/lib/categoryColors'
import CategoryIcon from '@/components/CategoryIcon'

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

  const colors = getCategoryColors(category.slug)

  return (
    <div className="space-y-10">
      <div>
        <Link href="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">
          ← 전체 카테고리
        </Link>

        <div className={`mt-5 p-6 rounded-2xl border bg-gradient-to-br ${colors.gradient} ${colors.border}`}>
          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-white/[0.08] bg-white/[0.06] p-3 text-white/85">
              <CategoryIcon slug={category.slug} className="h-8 w-8" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white">{category.name}</h1>
              {category.description && (
                <p className="text-white/50 mt-1 text-sm">{category.description}</p>
              )}
            </div>
          </div>
          <p className="text-white/25 text-xs mt-4">{articles?.length ?? 0}개 문서</p>
        </div>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(articles as ArticleWithCategory[]).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/20 text-sm">아직 문서가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
