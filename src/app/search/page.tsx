import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import type { ArticleWithCategory } from '@/types'

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let articles: ArticleWithCategory[] = []

  if (query) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    articles = (data as ArticleWithCategory[]) ?? []
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">검색</h1>
        {query && (
          <p className="text-gray-400 mt-1">
            &quot;{query}&quot; — {articles.length}개 결과
          </p>
        )}
      </div>

      {!query && (
        <p className="text-gray-500">검색어를 입력하세요.</p>
      )}

      {query && articles.length === 0 && (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      )}

      {articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
