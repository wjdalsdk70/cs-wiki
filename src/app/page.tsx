import { createClient } from '@/lib/supabase/server'
import CategoryCard from '@/components/CategoryCard'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
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

  const totalArticles = counts?.length ?? 0

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-200 text-xs font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          {totalArticles}개 문서
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">
          컴퓨터과학 개념을
          <br />
          <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
            빠르게 찾아보세요.
          </span>
        </h1>
        <p className="text-white/40 mt-4 text-base max-w-lg leading-relaxed">
          자료구조, 알고리즘, 운영체제, 네트워크 등 CS 핵심 개념을 마크다운으로 정리한 개인 위키입니다.
        </p>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">카테고리</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories?.map((cat) => (
            <CategoryCard key={cat.id} category={cat} articleCount={countMap[cat.id] ?? 0} />
          ))}
        </div>
      </section>

      {/* Recent articles */}
      {articles && articles.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">최근 문서</h2>
            <Link href="/search" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(articles as ArticleWithCategory[]).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {(!articles || articles.length === 0) && (
        <section className="text-center py-20">
          <p className="text-white/20 text-sm">아직 문서가 없습니다.</p>
        </section>
      )}
    </div>
  )
}
