import { createClient } from '@/lib/supabase/server'
import ArticleEditor from '@/components/ArticleEditor'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: article }, { data: categories }] = await Promise.all([
    supabase.from('articles').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!article) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">문서 수정</h1>
      <ArticleEditor categories={categories ?? []} article={article} />
    </div>
  )
}
