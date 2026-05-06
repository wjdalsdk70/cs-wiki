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

    router.push(`/wiki/${result.data.slug}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">제목 *</label>
          <input
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
            placeholder="문서 제목"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">슬러그 *</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-blue-500 font-mono text-sm"
            placeholder="url-friendly-slug"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
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
          <label className="block text-sm text-gray-400 mb-1">태그 (쉼표로 구분)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
            placeholder="배열, 탐색, O(n)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">요약</label>
        <input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
          placeholder="문서 한 줄 요약"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-400">내용 (Markdown) *</label>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="text-xs text-blue-400 hover:underline"
          >
            {preview ? '편집' : '미리보기'}
          </button>
        </div>
        {preview ? (
          <div className="min-h-64 p-4 bg-gray-900 border border-gray-700 rounded-md">
            <div className="prose prose-invert prose-sm max-w-none prose-code:before:content-none prose-code:after:content-none">
              <pre className="whitespace-pre-wrap text-gray-300 font-sans">{content || '내용 없음'}</pre>
            </div>
          </div>
        ) : (
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:border-blue-500 font-mono text-sm resize-y"
            placeholder="# 제목&#10;&#10;내용을 작성하세요..."
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="published" className="text-sm text-gray-400">공개 (체크 해제 시 비공개)</label>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : isEdit ? '수정 저장' : '문서 생성'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
