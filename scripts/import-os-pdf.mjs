import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const sections = [
  ['운영체제와 컴퓨터시스템의 구조', 'os-computer-system-structure'],
  ['인터럽트', 'interrupt'],
  ['시스템콜과 modebit', 'system-call-modebit'],
  ['메모리계층', 'memory-hierarchy'],
  ['가상메모리, 페이지테이블, 페이지폴트, 스레싱', 'virtual-memory-page-table-page-fault-thrashing'],
  ['페이지히트와 페이지미스', 'page-hit-page-miss'],
  ['페이지교체 알고리즘#1. 오프라인알고리즘(LFD)', 'page-replacement-offline-lfd'],
  ['페이지교체 알고리즘#2. FIFO, LRU, NUR, LFU', 'page-replacement-fifo-lru-nur-lfu'],
  ['프로세스와 스레드의 차이', 'process-thread-difference'],
  ['프로그램의 컴파일 과정', 'program-compilation-process'],
  ['프로세스의 메모리 구조', 'process-memory-layout'],
  ['PCB와 컨텍스트 스위칭', 'pcb-context-switching'],
  ['프로세스의 상태', 'process-states'],
  ['멀티프로세싱과 멀티스레딩', 'multiprocessing-multithreading'],
  ['IPC', 'ipc'],
  ['공유자원과 경쟁상태 그리고 임계영역', 'shared-resource-race-condition-critical-section'],
  ['뮤텍스, 세마포어, 모니터', 'mutex-semaphore-monitor'],
  ['교착 상태(deadlock)', 'deadlock'],
  ['CPU 스케줄링 알고리즘 #1. 비선점형(FCFS, SJF, 우선순위)', 'cpu-scheduling-non-preemptive'],
  ['CPU 스케줄링 알고리즘 #2. 선점형(라운드로빈, SRF, 다단계큐)', 'cpu-scheduling-preemptive'],
  ['캐시 #1. 캐시히트와 캐시미스 그리고 실습', 'cache-hit-cache-miss'],
  ['캐시 #2. 캐시매핑 : 직접매핑, 연관매핑, 집합 - 연관매핑', 'cache-mapping'],
  ['메모리할당 #1. 연속할당 : 고정분할과 가변분할', 'contiguous-memory-allocation'],
  ['메모리할당 #2. 불연속할당 : 페이징, 세그멘테이션, 페이지드 세그멘테이션', 'non-contiguous-memory-allocation'],
  ['DEEP DIVE : LFD 알고리즘이 왜 최고의 페이지교체 알고리즘인가요?', 'deep-dive-lfd-page-replacement'],
  ['Q. convoy effect와 stavation의 차이는 무엇인가요?', 'convoy-effect-starvation'],
  ['Q. busy wait란 무엇인가요?', 'busy-wait'],
  ['Q. 운영체제와 펌웨어의 차이가 무엇인가요?', 'os-vs-firmware'],
]

const aliases = new Map([
  ['CPU 스케줄링 알고리즘 #2. 선점형(라운드로빈, SRF, 다단계큐)', 'CPU 스케줄링 알고리즘 #2. 선점형(라운드로빈, SRF,'],
  ['메모리할당 #2. 불연속할당 : 페이징, 세그멘테이션, 페이지드 세그멘테이션', '메모리할당 #2. 불연속할당 : 페이징, 세그멘테이션, 페이지드'],
])

const pdfPath = process.argv[2]

if (!pdfPath) {
  console.error('Usage: npm run import:os -- "/path/to/CS - 4. 운영체제.pdf"')
  process.exit(1)
}

if (!existsSync(pdfPath)) {
  console.error(`PDF not found: ${pdfPath}`)
  process.exit(1)
}

loadEnvFile('.env.local')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local')
  process.exit(1)
}

const text = extractPdfText(pdfPath)
const articles = buildArticles(text)

if (articles.length === 0) {
  console.error('No operating-system sections were extracted from the PDF.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

const { data: category, error: categoryError } = await supabase
  .from('categories')
  .upsert(
    {
      name: '운영체제',
      slug: 'operating-systems',
      description: '프로세스, 스레드, 메모리 관리, 파일 시스템',
      icon: '🖥️',
    },
    { onConflict: 'slug' }
  )
  .select('id')
  .single()

if (categoryError) {
  console.error('Failed to upsert operating-system category.')
  console.error(categoryError.message)
  process.exit(1)
}

const payload = articles.map((article) => ({
  ...article,
  category_id: category.id,
  is_published: true,
}))

const { error: articlesError } = await supabase
  .from('articles')
  .upsert(payload, { onConflict: 'slug' })

if (articlesError) {
  console.error('Failed to upsert articles.')
  console.error(articlesError.message)
  process.exit(1)
}

console.log(`Imported ${payload.length} operating-system articles.`)

function loadEnvFile(path) {
  if (!existsSync(path)) return

  const lines = readFileSync(path, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

function extractPdfText(path) {
  const outDir = mkdtempSync(join(tmpdir(), 'cs-os-'))
  const outPath = join(outDir, 'operating-systems.txt')
  execFileSync('pdftotext', ['-layout', path, outPath], { stdio: 'ignore' })
  return readFileSync(outPath, 'utf8')
}

function buildArticles(rawText) {
  const lines = rawText
    .replace(/\f/g, '\n')
    .split(/\r?\n/)
    .map(cleanLine)

  const contentStart = lines.findIndex((line, index) => (
    index > 300 && line === '운영체제와 컴퓨터시스템의 구조'
  ))

  if (contentStart === -1) return []

  const contentLines = lines.slice(contentStart)
  const boundaries = []

  for (const [title] of sections) {
    const marker = aliases.get(title) ?? title
    const index = contentLines.findIndex((line) => line === marker || line.startsWith(marker))
    if (index !== -1) boundaries.push({ title, index })
  }

  boundaries.sort((a, b) => a.index - b.index)

  return boundaries.map((boundary, index) => {
    const nextBoundary = boundaries[index + 1]
    const bodyLines = contentLines
      .slice(boundary.index + 1, nextBoundary?.index ?? contentLines.length)
      .filter(isUsefulLine)

    const content = toMarkdown(boundary.title, bodyLines)
    const section = sections.find(([title]) => title === boundary.title)

    return {
      title: boundary.title,
      slug: section[1],
      summary: summarize(bodyLines),
      content,
      tags: ['운영체제', ...inferTags(boundary.title)],
    }
  })
}

function cleanLine(line) {
  return line
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/●\s*/g, '- ')
    .replace(/[ \t]+$/g, '')
    .trim()
}

function isUsefulLine(line) {
  if (!line) return true
  if (/^CS지식의 정석\s*\/\s*\d+$/.test(line)) return false
  if (/^version\.\d/.test(line)) return false
  if (line.includes('저작권법 제 97조')) return false
  if (line.includes('무단으로 복제')) return false
  return true
}

function toMarkdown(title, lines) {
  const normalized = lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^(\d+)\.\s*/gm, '$1. ')
    .trim()

  return `# ${title}\n\n${normalized}`
}

function summarize(lines) {
  const firstText = lines
    .map((line) => line.replace(/^[-\d.]+\s*/, '').trim())
    .find((line) => line.length >= 20 && !line.startsWith('http'))

  if (!firstText) return null
  return firstText.length > 120 ? `${firstText.slice(0, 117)}...` : firstText
}

function inferTags(title) {
  const tags = []
  if (title.includes('메모리') || title.includes('페이지') || title.includes('캐시')) tags.push('메모리')
  if (title.includes('프로세스') || title.includes('스레드') || title.includes('IPC')) tags.push('프로세스')
  if (title.includes('스케줄링')) tags.push('CPU 스케줄링')
  if (title.includes('교착') || title.includes('뮤텍스') || title.includes('세마포어')) tags.push('동시성')
  if (title.includes('인터럽트') || title.includes('시스템콜')) tags.push('커널')
  return tags
}
