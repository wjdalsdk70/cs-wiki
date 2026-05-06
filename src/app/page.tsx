import { createClient } from '@/lib/supabase/server'
import CategoryCard from '@/components/CategoryCard'
import ArticleCard from '@/components/ArticleCard'
import type { ArticleWithCategory } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: articles }, { data: counts }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('articles').select('category_id').eq('is_published', true),
  ])

  const countMap: Record<string, number> = {}
  counts?.forEach((a) => {
    if (a.category_id) countMap[a.category_id] = (countMap[a.category_id] ?? 0) + 1
  })

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">CS Wiki</h1>
        <p className="text-gray-400">컴퓨터과학 핵심 개념을 정리한 위키입니다.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">카테고리</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories?.map((cat) => (
            <CategoryCard key={cat.id} category={cat} articleCount={countMap[cat.id] ?? 0} />
          ))}
        </div>
      </section>

      {articles && articles.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">최근 문서</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(articles as ArticleWithCategory[]).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
