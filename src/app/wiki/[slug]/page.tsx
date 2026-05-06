import { createClient } from '@/lib/supabase/server'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/25 mb-8">
        <Link href="/" className="hover:text-white/50 transition-colors">홈</Link>
        <span>/</span>
        {article.category && (
          <>
            <Link href={`/category/${article.category.slug}`} className="hover:text-white/50 transition-colors">
              {article.category.icon} {article.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-white/40 truncate max-w-xs">{article.title}</span>
      </div>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-white/[0.06]">
        <h1 className="text-3xl font-bold text-white leading-tight">{article.title}</h1>

        {article.summary && (
          <p className="text-white/40 mt-3 text-base leading-relaxed">{article.summary}</p>
        )}

        <div className="flex items-center gap-2 mt-5 flex-wrap">
          {article.tags?.map((tag: string) => (
            <span key={tag} className="text-xs px-2.5 py-1 bg-white/[0.05] text-white/35 rounded-full border border-white/[0.07]">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-white/20 text-xs mt-5">
          {new Date(article.updated_at).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
          })} 업데이트
        </p>
      </div>

      {/* Content */}
      <MarkdownRenderer content={article.content} />

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-white/[0.06] flex justify-between items-center">
        <Link href={article.category ? `/category/${article.category.slug}` : '/'} className="text-sm text-white/25 hover:text-white/50 transition-colors">
          ← {article.category?.name ?? '홈'}으로
        </Link>
      </div>
    </div>
  )
}
