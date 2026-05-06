import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configs = {
  database: {
    category: {
      name: '데이터베이스',
      slug: 'databases',
      description: '관계형 DB, SQL, 인덱싱, 트랜잭션',
      icon: '🗄️',
    },
    startAfter: 280,
    sections: [
      ['데이터베이스의 기본 #1 엔터티, 릴레이션, 속성, 도메인', 'database-entity-relation-attribute-domain'],
      ['데이터베이스의 기본 #2-1. 필드, 레코드, 타입', 'database-field-record-type'],
      ['데이터베이스의 기본 #2-2. CHAR와 VARCHAR의 차이', 'char-vs-varchar'],
      ['데이터베이스의 기본 #2-3. TEXT와 BLOB', 'text-and-blob'],
      ['데이터베이스의 기본 #2-4. ENUM과 SET', 'enum-and-set'],
      ['데이터베이스의 기본 #3. 관계와 키', 'database-relationship-and-key'],
      ['데이터베이스의 기본 #4. CRUD 실습', 'database-crud-practice'],
      ['데이터베이스의 기본 #5. ERD(Entity Relation Diagram)', 'erd'],
      ['데이터베이스의 기본 #6. 조인(내부조인, 외부조인)', 'inner-join-outer-join'],
      ['데이터베이스의 기본 #7. 교차조인과 자연조인', 'cross-join-natural-join'],
      ['Q. inner join이 아닌 left outer join을 써야할 때는 언제인가요?', 'when-to-use-left-outer-join'],
      ['DEEP DIVE : 쇼핑몰 ERD 구축해보기', 'shopping-mall-erd'],
      ['조인 알고리즘 #1. 중첩루프조인', 'nested-loop-join'],
      ['조인 알고리즘 #2. 정렬병합조인', 'sort-merge-join'],
      ['조인 알고리즘 #3. 해시조인', 'hash-join'],
      ['트랜잭션 #1. 트랜잭션, 커밋, 롤백, 트랜잭션 전파', 'transaction-commit-rollback-propagation'],
      ['트랜잭션 #2. ACID', 'acid'],
      ['트랜잭션 #3. 격리성', 'transaction-isolation'],
      ['트랜잭션 #4. 격리수준에 따른 현상 (팬텀리드, 더티리드 등)', 'transaction-isolation-phenomena'],
      ['트랜잭션 #5. 격리수준(SERIALIZABLE, REPEATABLE_READ 등)', 'transaction-isolation-levels'],
      ['인덱스 #1. 인덱스의 구조와 효율적인 이유', 'database-index-structure'],
      ['인덱스 #2. 인덱스 성능 최적화', 'database-index-optimization'],
      ['인덱스 #3. MongoDB로 실습해보기', 'mongodb-index-practice'],
      ['DEEP DIVE : clustered index와 non-clustered index와의 차이', 'clustered-vs-non-clustered-index'],
      ['데이터베이스 정규화과정 #1. 개념과 이상현상', 'normalization-anomaly'],
      ['데이터베이스 정규화과정 #2. 함수적 종속성', 'functional-dependency'],
      ['데이터베이스 정규화과정 #3. 제 1정규형', 'first-normal-form'],
      ['데이터베이스 정규화과정 #4. 제 2정규형', 'second-normal-form'],
      ['데이터베이스 정규화과정 #5. 제 3정규형', 'third-normal-form'],
      ['데이터베이스 정규화과정 #6. 보이스 / 코드 정규형', 'boyce-codd-normal-form'],
      ['Q. 정규화과정은 꼭 필요할까요?', 'is-normalization-necessary'],
      ['Q. 관계형데이터베이스와 NoSQL데이터베이스의 차이는?', 'rdbms-vs-nosql'],
      ['DEEP DIVE : MongoDB를 쓸 때 주의할 점', 'mongodb-cautions'],
      ['Q. MySQL의 innoDB, MyISAM 스토리지엔진의 차이는?', 'innodb-vs-myisam'],
      ['Q. 데이터베이스의 데드락과 해결방법을 설명해주세요', 'database-deadlock-solution'],
    ],
    aliases: new Map([
      ['Q. inner join이 아닌 left outer join을 써야할 때는 언제인가요?', 'Q. inner join이 아닌 left outer join을 써야할 때는'],
      ['DEEP DIVE : clustered index와 non-clustered index와의 차이', 'DEEP DIVE : clustered index와 non-clustered index와의'],
    ]),
  },
  'data-structures': {
    category: {
      name: '자료구조',
      slug: 'data-structures',
      description: '배열, 링크드리스트, 트리, 그래프 등 데이터를 구조화하는 방법',
      icon: '🗃️',
    },
    startAfter: 250,
    sections: [
      ['자료구조의 기본', 'data-structure-basics'],
      ['시간복잡도(time complexity)', 'time-complexity'],
      ['빅오표기법(Big - O notation)', 'big-o-notation'],
      ['문제로 연습하는 시간복잡도 Q1', 'time-complexity-practice-q1'],
      ['문제로 연습하는 시간복잡도 Q2', 'time-complexity-practice-q2'],
      ['문제로 연습하는 시간복잡도 Q3', 'time-complexity-practice-q3'],
      ['문제로 연습하는 시간복잡도 Q4', 'time-complexity-practice-q4'],
      ['시간복잡도가 필요한 이유', 'why-time-complexity-matters'],
      ['공간복잡도(space complexity)', 'space-complexity'],
      ['정적배열(Array)', 'static-array'],
      ['동적배열(vector)', 'dynamic-array-vector'],
      ['메모리와 포인터(pointer) #1 메모리와 주소', 'memory-pointer-address'],
      ['메모리와 포인터(pointer) #2 포인터', 'pointer'],
      ['메모리와 포인터(pointer) #3 역참조연산자', 'dereference-operator'],
      ['메모리와 포인터(pointer) #4 array to pointer decay', 'array-to-pointer-decay'],
      ['연결리스트(linked List)', 'linked-list'],
      ['스택(stack)', 'stack'],
      ['큐(queue)', 'queue'],
      ['그래프이론의 기초(Graph, Vertex, Edge, Weight)', 'graph-vertex-edge-weight'],
      ['트리(Tree Data Structure)', 'tree'],
      ['이진트리와 이진탐색트리', 'binary-tree-binary-search-tree'],
      ['인접행렬(adjacency matrix)', 'adjacency-matrix'],
      ['인접리스트(adjacency list)', 'adjacency-list'],
      ['인접행렬과 인접리스트의 차이', 'adjacency-matrix-vs-list'],
      ['맵(Map)', 'map'],
      ['셋(Set)', 'set'],
      ['해시테이블(Hash Table)', 'hash-table'],
      ['힙', 'heap'],
      ['자료구조의 시간복잡도 총정리', 'data-structure-time-complexity-summary'],
      ['DEEP DIVE : LRU 페이지 교체 알고리즘 구현', 'lru-page-replacement-implementation'],
      ['DEEP DIVE : vector의 push_back()의 시간복잡도가 O(1)인 이유는 무엇인가요?', 'why-vector-push-back-is-o-1'],
      ['Q. 배열과 연결리스트의 차이가 무엇인가요?', 'array-vs-linked-list'],
      ['Q. 로또번호 7개를 셔플할 때 어떤 자료구조로 구축해야 하며 로직은 어떻게 될까요?', 'lotto-number-shuffle-data-structure'],
    ],
    aliases: new Map([
      ['DEEP DIVE : vector의 push_back()의 시간복잡도가 O(1)인 이유는 무엇인가요?', 'DEEP DIVE : vector의 push_back()의 시간복잡도가 O(1)인'],
      ['Q. 로또번호 7개를 셔플할 때 어떤 자료구조로 구축해야 하며 로직은 어떻게 될까요?', 'Q. 로또번호 7개를 셔플할 때 어떤 자료구조로 구축해야'],
    ]),
  },
  'design-patterns': {
    category: {
      name: '개발',
      slug: 'languages-compilers',
      description: '프로그래밍 언어 이론, 파싱, 최적화',
      icon: '📝',
    },
    startAfter: 120,
    sections: [
      ['디자인패턴의 소개', 'design-pattern-introduction'],
      ['라이브러리와 프레임워크의 차이', 'library-vs-framework'],
      ['싱글톤 패턴', 'singleton-pattern'],
      ['DEEP DIVE : 싱글톤 패턴을 구현하는 7가지 방법 #1', 'singleton-implementation-ways-1'],
      ['DEEP DIVE : 싱글톤 패턴을 구현하는 7가지 방법 #2', 'singleton-implementation-ways-2'],
      ['팩토리패턴', 'factory-pattern'],
      ['이터레이터패턴', 'iterator-pattern'],
      ['DI와 DIP', 'di-and-dip'],
      ['전략패턴', 'strategy-pattern'],
      ['옵저버 패턴', 'observer-pattern'],
      ['프록시 패턴', 'proxy-pattern'],
      ['MVC MVP MVVM패턴', 'mvc-mvp-mvvm-pattern'],
      ['Spring의 MVC패턴 적용사례', 'spring-mvc-pattern'],
      ['flux패턴', 'flux-pattern'],
      ['Q. 전략패턴과 의존성주입의 차이는 무엇인가요?', 'strategy-pattern-vs-dependency-injection'],
      ['Q. 컨텍스트란 무엇인가요?', 'what-is-context'],
    ],
  },
  'dev-essentials': {
    category: {
      name: '개발',
      slug: 'languages-compilers',
      description: '프로그래밍 언어 이론, 파싱, 최적화',
      icon: '📝',
    },
    startAfter: 150,
    sections: [
      ['데이터교환형식 #1. JSON과 직렬화와 역직렬화', 'json-serialization-deserialization'],
      ['데이터포맷 #2. XML', 'xml-data-format'],
      ['API #1 개념', 'api-concept'],
      ['API #2 실습 OPEN API를 이용해 온도예측하기', 'open-api-practice-temperature'],
      ['API #3 실습 Node.js를 이용한 간단한 API구축', 'nodejs-api-practice'],
      ['클라우드 #1 가상머신', 'cloud-virtual-machine'],
      ['클라우드 #2 오프프레미스, 온프레미스', 'off-premise-on-premise'],
      ['클라우드 #3 IaaS, PaaS , SaaS', 'iaas-paas-saas'],
      ['클라우드 #4 컨테이너와 도커', 'container-and-docker'],
      ['CI/CD(Continuous Integration/Delivery & Deployment)', 'ci-cd'],
      ['Q. 클래스와 객체와 인스턴스의 차이가 뭔가요?', 'class-object-instance'],
      ['Q. static키워드는 왜 사용하며 단점은 무엇인가요?', 'static-keyword'],
      ['Q. 오버로딩과 오버라이딩은 무엇인가요?', 'overloading-vs-overriding'],
      ['Q. 추상화란 무엇인가요?', 'abstraction'],
      ['Q.컴파일러와 인터프리터의 차이가 무엇인가요?', 'compiler-vs-interpreter'],
      ['JIT 컴파일러', 'jit-compiler'],
    ],
  },
}

const subject = process.argv[2]
const pdfPath = process.argv[3]
const config = configs[subject]

if (!config || !pdfPath) {
  console.error('Usage: node scripts/import-cs-pdf.mjs <database|data-structures|design-patterns|dev-essentials> "/path/to/file.pdf"')
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

const text = extractPdfText(pdfPath, subject)
const articles = buildArticles(text, config)

if (articles.length === 0) {
  console.error(`No ${subject} sections were extracted from the PDF.`)
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
  .upsert(config.category, { onConflict: 'slug' })
  .select('id')
  .single()

if (categoryError) {
  console.error(`Failed to upsert ${subject} category.`)
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

console.log(`Imported ${payload.length} ${subject} articles.`)

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

function extractPdfText(path, name) {
  const outDir = mkdtempSync(join(tmpdir(), `cs-${name}-`))
  const outPath = join(outDir, `${name}.txt`)
  execFileSync('pdftotext', ['-layout', path, outPath], { stdio: 'ignore' })
  return readFileSync(outPath, 'utf8')
}

function buildArticles(rawText, config) {
  const lines = rawText
    .replace(/\f/g, '\n\f\n')
    .split(/\r?\n/)
    .map(cleanLine)

  const [firstTitle] = config.sections[0]
  const contentStart = lines.findIndex((line, index) => index > config.startAfter && line === firstTitle)
  if (contentStart === -1) return []

  const contentLines = lines.slice(contentStart)
  const boundaries = []

  for (const [title] of config.sections) {
    const marker = config.aliases?.get(title) ?? title
    const index = contentLines.findIndex((line) => line === marker || line.startsWith(marker))
    if (index !== -1) boundaries.push({ title, index })
  }

  boundaries.sort((a, b) => a.index - b.index)

  return boundaries.map((boundary, index) => {
    const nextBoundary = boundaries[index + 1]
    const bodyLines = contentLines
      .slice(boundary.index + 1, nextBoundary?.index ?? contentLines.length)
      .filter(isUsefulLine)

    const section = config.sections.find(([title]) => title === boundary.title)

    return {
      title: boundary.title,
      slug: section[1],
      summary: summarize(bodyLines),
      content: toMarkdown(boundary.title, bodyLines),
      tags: [config.category.name, ...inferTags(boundary.title)],
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
  if (line === '\f') return false
  if (/^CS지식의 정석\s*\/\s*\d+$/.test(line)) return false
  if (/^\d+$/.test(line)) return false
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
  if (title.includes('트랜잭션') || title.includes('ACID') || title.includes('데드락')) tags.push('트랜잭션')
  if (title.includes('인덱스') || title.includes('MongoDB')) tags.push('인덱스')
  if (title.includes('정규화') || title.includes('종속')) tags.push('정규화')
  if (title.includes('조인') || title.includes('JOIN')) tags.push('조인')
  if (title.includes('키') || title.includes('ERD') || title.includes('관계')) tags.push('모델링')
  if (title.includes('복잡도')) tags.push('복잡도')
  if (title.includes('배열') || title.includes('vector')) tags.push('배열')
  if (title.includes('리스트')) tags.push('리스트')
  if (title.includes('트리') || title.includes('힙')) tags.push('트리')
  if (title.includes('그래프') || title.includes('인접')) tags.push('그래프')
  if (title.includes('해시') || title.includes('맵') || title.includes('셋')) tags.push('해시')
  return tags
}
