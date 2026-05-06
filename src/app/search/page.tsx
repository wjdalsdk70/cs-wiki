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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {query ? (
            <>
              &ldquo;<span className="text-indigo-400">{query}</span>&rdquo; 검색 결과
            </>
          ) : '검색'}
        </h1>
        {query && (
          <p className="text-white/30 text-sm mt-1">{articles.length}개 문서 발견</p>
        )}
      </div>

      {!query && (
        <p className="text-white/25 text-sm">상단 검색창에서 검색어를 입력하세요.</p>
      )}

      {query && articles.length === 0 && (
        <p className="text-white/25 text-sm">일치하는 문서가 없습니다.</p>
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
