import { createClient } from '@/lib/supabase/server'
import ArticleDeleteButton from '@/components/ArticleDeleteButton'
import Link from 'next/link'
import type { ArticleWithCategory } from '@/types'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">문서 관리</h1>
          <p className="text-white/30 text-sm mt-1">문서 생성, 수정, 삭제는 이 경로에서만 처리합니다.</p>
        </div>
        <Link
          href="/admin/new"
          className="shrink-0 px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          새 문서
        </Link>
      </div>

      {articles && articles.length > 0 ? (
        <div className="divide-y divide-white/[0.06] border border-white/[0.07] rounded-xl overflow-hidden bg-white/[0.03]">
          {(articles as ArticleWithCategory[]).map((article) => (
            <div key={article.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/wiki/${article.slug}`}
                    className="font-medium text-white/90 hover:text-white transition-colors"
                  >
                    {article.title}
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    article.is_published
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-white/[0.05] text-white/30 border-white/[0.08]'
                  }`}>
                    {article.is_published ? '공개' : '비공개'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/25 flex-wrap">
                  {article.category && <span>{article.category.icon} {article.category.name}</span>}
                  <span>/wiki/{article.slug}</span>
                  <span>
                    {new Date(article.updated_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:justify-end">
                <Link
                  href={`/admin/edit/${article.id}`}
                  className="px-3 py-1.5 text-xs bg-white/[0.06] text-white/60 rounded-lg border border-white/[0.08] hover:bg-white/[0.1] hover:text-white/80 transition-colors"
                >
                  수정
                </Link>
                <ArticleDeleteButton articleId={article.id} title={article.title} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-white/[0.07] rounded-xl bg-white/[0.03]">
          <p className="text-white/25 text-sm mb-4">아직 문서가 없습니다.</p>
          <Link href="/admin/new" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            첫 문서 작성하기
          </Link>
        </div>
      )}
    </div>
  )
}
