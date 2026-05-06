'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  content: string
}

const codeLinePattern = /^(import\s|from\s|def\s|if __name__|print\(|[a-zA-Z_]\w*\s*=|[a-zA-Z_]\w*\.\w+\()/

function isCodeLine(line: string) {
  return codeLinePattern.test(line.trim())
}

function isReferenceLine(line: string) {
  return /^\[[^\]]+\]$/.test(line.trim())
}

function isLikelyHeading(line: string, previous: string | undefined, next: string | undefined) {
  const trimmed = line.trim()
  if (!trimmed || !next?.trim()) return false
  if (trimmed.startsWith('#') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) return false
  if (trimmed.length > 42) return false
  if (/[.!?。]$/.test(trimmed)) return false
  if (/(습니다|입니다|합니다|됩니다|있습니다|없습니다|합니다)$/.test(trimmed)) return false
  if (isCodeLine(trimmed)) return false
  return !previous?.trim()
}

function formatCodeLine(line: string, context: 'function' | 'main' | null) {
  const trimmed = line.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('def ') || trimmed.startsWith('if __name__')) return trimmed
  if (context) return `    ${trimmed}`
  return trimmed
}

function normalizeImportedMarkdown(content: string) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const normalized: string[] = []
  let inCodeBlock = false
  let codeContext: 'function' | 'main' | null = null

  function closeCodeBlock() {
    if (!inCodeBlock) return
    normalized.push('```')
    normalized.push('')
    inCodeBlock = false
    codeContext = null
  }

  lines.forEach((line, index) => {
    const previous = lines[index - 1]
    const next = lines.slice(index + 1).find((candidate) => candidate.trim())
    const trimmed = line.trim()

    if (isCodeLine(trimmed)) {
      if (!inCodeBlock) {
        normalized.push('')
        normalized.push('```python')
        inCodeBlock = true
      }

      if (trimmed.startsWith('def ')) codeContext = 'function'
      if (trimmed.startsWith('if __name__')) codeContext = 'main'
      normalized.push(formatCodeLine(trimmed, codeContext))
      return
    }

    if (inCodeBlock && !trimmed) {
      normalized.push('')
      return
    }

    closeCodeBlock()

    if (isReferenceLine(trimmed)) {
      normalized.push(`### ${trimmed.slice(1, -1)}`)
      return
    }

    if (isLikelyHeading(trimmed, previous, next)) {
      normalized.push(`## ${trimmed}`)
      return
    }

    normalized.push(line)
  })

  closeCodeBlock()

  return normalized
    .join('\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
}

export default function MarkdownRenderer({ content }: Props) {
  const markdown = normalizeImportedMarkdown(content)

  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-white prose-headings:font-bold
      prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
      prose-p:text-gray-300 prose-p:leading-relaxed
      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
      prose-code:bg-gray-800 prose-code:text-blue-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
      prose-blockquote:border-blue-500 prose-blockquote:text-gray-400
      prose-strong:text-white
      prose-li:text-gray-300
      prose-table:text-gray-300
      prose-th:text-gray-200 prose-th:bg-gray-800
      prose-td:border-gray-700 prose-tr:border-gray-700
      prose-hr:border-gray-700">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
