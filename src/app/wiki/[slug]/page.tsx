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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Link href="/" className="hover:text-gray-300">홈</Link>
          <span>/</span>
          {article.category && (
            <>
              <Link href={`/category/${article.category.slug}`} className="hover:text-gray-300">
                {article.category.icon} {article.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-400">{article.title}</span>
        </div>

        <h1 className="text-3xl font-bold text-white">{article.title}</h1>

        {article.summary && (
          <p className="text-gray-400 mt-2 text-lg">{article.summary}</p>
        )}

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {article.tags?.map((tag: string) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded border border-gray-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="text-xs text-gray-600 mt-3">
          {new Date(article.updated_at).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })} 업데이트
        </div>
      </div>

      <hr className="border-gray-800" />

      <MarkdownRenderer content={article.content} />

      <hr className="border-gray-800" />

      <div className="flex justify-end">
        <Link
          href={`/admin/edit/${article.id}`}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          수정하기
        </Link>
      </div>
    </div>
  )
}
