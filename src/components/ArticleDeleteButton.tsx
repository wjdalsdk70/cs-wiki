'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  articleId: string
  title: string
}

export default function ArticleDeleteButton({ articleId, title }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm(`"${title}" 문서를 삭제할까요?`)) return

    setError(null)
    setDeleting(true)

    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId)

    setDeleting(false)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="px-3 py-1.5 text-xs bg-red-500/10 text-red-300 rounded-lg border border-red-500/20 hover:bg-red-500/15 disabled:opacity-40 transition-colors"
      >
        {deleting ? '삭제 중...' : '삭제'}
      </button>
      {error && <p className="text-xs text-red-300 max-w-48 text-right">{error}</p>}
    </div>
  )
}
