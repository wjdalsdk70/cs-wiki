'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  content: string
}

export default function MarkdownRenderer({ content }: Props) {
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
        {content}
      </ReactMarkdown>
    </div>
  )
}
