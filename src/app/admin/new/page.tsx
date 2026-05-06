import { createClient } from '@/lib/supabase/server'
import ArticleEditor from '@/components/ArticleEditor'

export default async function NewArticlePage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">새 문서 작성</h1>
      <ArticleEditor categories={categories ?? []} />
    </div>
  )
}
