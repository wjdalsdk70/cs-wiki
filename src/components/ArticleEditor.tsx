'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Article, Category } from '@/types'

type Props = {
  categories: Category[]
  article?: Article
}

export default function ArticleEditor({ categories, article }: Props) {
  const router = useRouter()
  const isEdit = !!article

  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [summary, setSummary] = useState(article?.summary ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [categoryId, setCategoryId] = useState(article?.category_id ?? '')
  const [tags, setTags] = useState(article?.tags?.join(', ') ?? '')
  const [isPublished, setIsPublished] = useState(article?.is_published ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit) {
      setSlug(generateSlug(value))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const supabase = createClient()
    const payload = {
      title,
      slug,
      summary: summary || null,
      content,
      category_id: categoryId || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      is_published: isPublished,
    }

    let result
    if (isEdit) {
      result = await supabase
        .from('articles')
        .update(payload)
        .eq('id', article.id)
        .select('slug')
        .single()
    } else {
      result = await supabase
        .from('articles')
        .insert(payload)
        .select('slug')
        .single()
    }

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const inputCls = "w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/90 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] placeholder-white/20 transition-all"
  const labelCls = "block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>제목 *</label>
          <input
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputCls}
            placeholder="문서 제목"
          />
        </div>
        <div>
          <label className={labelCls}>슬러그 *</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={`${inputCls} font-mono`}
            placeholder="url-friendly-slug"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputCls}
          >
            <option value="">카테고리 없음</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>태그 (쉼표로 구분)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputCls}
            placeholder="배열, 탐색, O(n)"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>요약</label>
        <input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={inputCls}
          placeholder="문서 한 줄 요약"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls} style={{ marginBottom: 0 }}>내용 (Markdown) *</label>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {preview ? '← 편집' : '미리보기 →'}
          </button>
        </div>
        {preview ? (
          <div className="min-h-64 p-5 bg-white/[0.03] border border-white/[0.08] rounded-lg">
            <pre className="whitespace-pre-wrap text-white/50 text-sm font-mono leading-relaxed">{content || '내용 없음'}</pre>
          </div>
        ) : (
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white/80 focus:outline-none focus:border-indigo-500/50 font-mono text-sm resize-y placeholder-white/15 transition-all"
            placeholder="# 제목&#10;&#10;내용을 작성하세요..."
          />
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          id="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4 accent-indigo-500"
        />
        <label htmlFor="published" className="text-sm text-white/30">공개 (체크 해제 시 비공개)</label>
      </div>

      {error && (
        <p className="text-red-400/80 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 transition-all shadow-lg shadow-indigo-500/20"
        >
          {saving ? '저장 중...' : isEdit ? '수정 저장' : '문서 생성'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 text-sm bg-white/[0.05] text-white/50 rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-all"
        >
          취소
        </button>
      </div>
    </form>
  )
}
