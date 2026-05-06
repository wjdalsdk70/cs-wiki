import { createClient } from '@/lib/supabase/server'
import ArticleDeleteButton from '@/components/ArticleDeleteButton'
import Link from 'next/link'
import type { ArticleWithCategory } from '@/types'
import { logoutAdmin } from './login/actions'

export const revalidate = 0

type Props = {
  searchParams: Promise<{
    q?: string
    status?: string
    category?: string
    sort?: string
  }>
}

function includesQuery(article: ArticleWithCategory, query: string) {
  if (!query) return true

  const haystack = [
    article.title,
    article.summary,
    article.content,
    article.slug,
    article.category?.name,
    ...(article.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(query.toLowerCase())
}

function sortArticles(articles: ArticleWithCategory[], sort: string) {
  return [...articles].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title, 'ko-KR')
    if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })
}

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams
  const query = params.q?.trim() ?? ''
  const status = params.status ?? 'all'
  const categoryId = params.category ?? 'all'
  const sort = params.sort ?? 'updated'
  const supabase = await createClient()

  const [{ data: articles }, { data: categories }] = await Promise.all([
    supabase
    .from('articles')
    .select('*, category:categories(*)')
      .order('updated_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true }),
  ])

  const allArticles = ((articles as ArticleWithCategory[]) ?? [])
  const filteredArticles = sortArticles(
    allArticles.filter((article) => {
      if (!includesQuery(article, query)) return false
      if (status === 'published' && !article.is_published) return false
      if (status === 'draft' && article.is_published) return false
      if (categoryId !== 'all' && article.category_id !== categoryId) return false
      return true
    }),
    sort,
  )
  const publishedCount = allArticles.filter((article) => article.is_published).length
  const draftCount = allArticles.length - publishedCount
  const hasFilter = Boolean(query) || status !== 'all' || categoryId !== 'all' || sort !== 'updated'

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">문서 관리</h1>
          <p className="text-white/30 text-sm mt-1">문서 생성, 수정, 삭제는 이 경로에서만 처리합니다.</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-white/[0.05] text-white/50 rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-all"
            >
              로그아웃
            </button>
          </form>
          <Link
            href="/admin/new"
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20"
          >
            새 문서
          </Link>
        </div>
      </div>

      <form className="space-y-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            name="q"
            defaultValue={query}
            placeholder="제목, 내용, 슬러그, 태그 검색"
            className="w-full rounded-lg border border-white/[0.08] bg-black/20 py-2.5 pl-10 pr-3 text-sm text-white/80 placeholder-white/25 transition-all focus:border-indigo-500/60 focus:bg-white/[0.06] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-white/70 focus:border-indigo-500/60 focus:outline-none"
          >
            <option value="all">전체 상태</option>
            <option value="published">공개만</option>
            <option value="draft">비공개만</option>
          </select>
          <select
            name="category"
            defaultValue={categoryId}
            className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-white/70 focus:border-indigo-500/60 focus:outline-none"
          >
            <option value="all">전체 카테고리</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-white/70 focus:border-indigo-500/60 focus:outline-none"
          >
            <option value="updated">최근 수정순</option>
            <option value="oldest">오래된 생성순</option>
            <option value="title">제목순</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-white/[0.08] px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.12] hover:text-white"
          >
            찾기
          </button>
          {hasFilter && (
            <Link
              href="/admin"
              className="rounded-lg border border-white/[0.08] px-4 py-2 text-center text-sm text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              초기화
            </Link>
          )}
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-xs text-white/35">
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1">
          결과 {filteredArticles.length}개
        </span>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-300/80">
          공개 {publishedCount}개
        </span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1">
          비공개 {draftCount}개
        </span>
      </div>

      {allArticles.length > 0 ? (
        <div className="divide-y divide-white/[0.06] border border-white/[0.07] rounded-xl overflow-hidden bg-white/[0.03]">
          {filteredArticles.map((article) => (
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
                {article.summary && (
                  <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-white/35">
                    {article.summary}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-white/25 flex-wrap">
                  {article.category && <span>{article.category.icon} {article.category.name}</span>}
                  <span>/wiki/{article.slug}</span>
                  {article.tags?.slice(0, 3).map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
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
          {filteredArticles.length === 0 && (
            <div className="px-4 py-16 text-center">
              <p className="text-sm text-white/30">조건에 맞는 문서가 없습니다.</p>
              <Link href="/admin" className="mt-3 inline-block text-sm text-indigo-400 transition-colors hover:text-indigo-300">
                전체 목록 보기
              </Link>
            </div>
          )}
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
