import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const sections = [
  ['네트워크의 기초 #1 네트워크, 처리량, 트래픽, 대역폭, RTT', 'network-basics-traffic-bandwidth-rtt'],
  ['네트워크의 기초 #2 네트워크 토폴로지 : 버스, 스타, 트리', 'network-topology-bus-star-tree'],
  ['네트워크의 기초 #3 네트워크 토폴로지 : 링, 메시', 'network-topology-ring-mesh'],
  ['네트워크의 기초 #4 병목현상과 네트워크 토폴로지의 필요성', 'network-bottleneck-topology'],
  ['네트워크의 기초 #5 유니캐스트, 멀티캐스트, 브로드캐스트', 'unicast-multicast-broadcast'],
  ['네트워크의 분류 : LAN, MAN, WAN', 'lan-man-wan'],
  ['TCP/IP 4계층 #1. 캡슐화, 비캡슐화, PDU, OSI 7계층', 'tcp-ip-layers-encapsulation-pdu-osi'],
  ['TCP/IP 4계층 #2. MTU와 MSS와 PMTUD', 'mtu-mss-pmtud'],
  ['TCP/IP 4계층 #3. 애플리케이션 계층(application)', 'application-layer'],
  ['TCP/IP 4계층 #4. 전송 계층(transport)', 'transport-layer-tcp-udp'],
  ['TCP/IP 4계층 #5. 인터넷 계층(network)', 'internet-layer'],
  ['TCP의 연결성립 : 3-웨이 핸드셰이크', 'tcp-three-way-handshake'],
  ['TCP의 연결해제 : 4-웨이 핸드셰이크와 TIME_WAIT', 'tcp-four-way-handshake-time-wait'],
  ['라우팅 #1. 개념과 라우터', 'routing-router'],
  ['라우팅 #2. 라우팅 테이블', 'routing-table'],
  ['IP주소, MAC주소, ARP, RARP', 'ip-mac-arp-rarp'],
  ['IP주소체계 #1: 이진수 이해하기', 'ip-address-binary'],
  ['IP주소체계 #2: IPv4와 IPv6', 'ipv4-ipv6'],
  ['IP주소체계 #3. 클래스풀(Classful IP Addressing)', 'classful-ip-addressing'],
  ['IP주소체계 #4. 클래스리스와 서브넷마스크, 서브네팅', 'cidr-subnet-mask-subnetting'],
  ['IP주소체계 #5. 공인IP(public IP)와 사설IP(private IP)와 NAT', 'public-private-ip-nat'],
  ['HTTP 헤더(header)', 'http-headers'],
  ['DEEP DIVE : HTTP/1.0과 HTTP/1.1의 차이, keep-alive, HOL까지', 'http-1-0-vs-1-1-keep-alive-hol'],
  ['DEEP DIVE : HTTP/2와 HTTP/3의 차이', 'http-2-vs-http-3'],
  ['DEEP DIVE : HTTPS와 TLS #1. 암호화(대칭, 비대칭)', 'https-tls-encryption'],
  ['DEEP DIVE : HTTPS와 TLS #2. TLS 핸드셰이크', 'tls-handshake'],
  ['웹브라우저의 캐시 #1. 로컬스토리지의 개념', 'browser-cache-local-storage'],
  ['웹브라우저의 캐시 #2. 로컬스토리지와 오리진', 'local-storage-origin'],
  ['웹브라우저의 캐시 #3. 로컬스토리지를 활용사례 : 캐싱', 'local-storage-caching'],
  ['웹브라우저의 캐시 #4. 세션스토리지', 'session-storage'],
  ['웹브라우저의 캐시 #5. 쿠키(Cookie)', 'cookie'],
  ['웹브라우저의 캐시 #6. 로컬스토리지, 세션스토리지, 쿠키의 공통점과 차이점', 'local-storage-session-storage-cookie'],
  ['로그인 #1. 세션기반인증방식 : 개념', 'session-authentication'],
  ['로그인 #2 세션기반인증방식 : 실습', 'session-authentication-practice'],
  ['로그인 #3. 토큰기반인증방식(access토큰, refresh토큰) 개념', 'token-authentication-access-refresh-token'],
  ['로그인 #4. 토큰기반인증방식(access토큰, refresh토큰) 실습', 'token-authentication-practice'],
  ['꼭 외워야 하는 HTTP 상태코드(status code)', 'http-status-codes'],
  ['HTTP 메서드 #1. GET과 POST의 차이', 'get-vs-post'],
  ['HTTP 메서드 #2. PUT과 PATCH의 차이', 'put-vs-patch'],
  ['네트워크를 이루는 장치의 이해', 'network-devices-overview'],
  ['네트워크를 이루는 장치 #1 애플리케이션 계층', 'l7-network-devices'],
  ['네트워크를 이루는 장치 #2 전송 계층', 'l4-network-devices'],
  ['네트워크를 이루는 장치 #3 인터넷 계층', 'l3-network-devices'],
  ['네트워크를 이루는 장치 #4 데이터링크계층', 'l2-network-devices'],
  ['네트워크를 이루는 장치 #5 물리계층', 'physical-layer-devices'],
  ['유선LAN #1. 전이중화 통신, CSMA/CD', 'wired-lan-full-duplex-csma-cd'],
  ['유선LAN #2. 케이블', 'wired-lan-cables'],
  ['무선LAN #1. 반이중화 통신, CSMA/CA, 와이파이', 'wireless-lan-csma-ca-wifi'],
  ['무선LAN #2. 주파수와 2.4GHz와 5GHz의 차이', 'wireless-lan-2-4ghz-vs-5ghz'],
  ['DEEP DIVE : 대규모 트래픽으로 인한 서버 과부하 해결방법 #1', 'server-overload-solution-1'],
  ['DEEP DIVE : 대규모 트래픽으로 인한 서버 과부하 해결방법 #2', 'server-overload-solution-2'],
  ['Q. REST API란 무엇인가요?', 'what-is-rest-api'],
  ['Q. 브라우저 렌더링과정이란 무엇인가요?', 'browser-rendering-process'],
  ['Q. www.naver.com을 쳤을 때 생기는 과정, 그리고 DNS까지 설명해주세요', 'what-happens-when-entering-url-dns'],
  ['Q. 이더넷 프레임는 무엇이며 구조가 어떻게 되나요?', 'ethernet-frame'],
  ['Q. CORS란 무엇인가요?', 'cors'],
  ['Q. 네이글 알고리즘이란 무엇인가요?', 'nagle-algorithm'],
  ['Q. HTTP의 멱등성이 무엇인지 설명해주세요', 'http-idempotency'],
  ['HTTP 멱등성을 고려한 API 구축 실습', 'http-idempotency-api-practice'],
  ['Q. XSS가 무엇인가요?', 'xss'],
  ['Q. CSRF가 무엇인가요?', 'csrf'],
]

const aliases = new Map([
  ['IP주소체계 #5. 공인IP(public IP)와 사설IP(private IP)와 NAT', 'IP주소체계 #5. 공인IP(public IP)와 사설IP(private IP)와'],
  ['DEEP DIVE : HTTP/1.0과 HTTP/1.1의 차이, keep-alive, HOL까지', 'DEEP DIVE : HTTP/1.0과 HTTP/1.1의 차이, keep-alive, HOL까지'],
  ['Q. www.naver.com을 쳤을 때 생기는 과정, 그리고 DNS까지 설명해주세요', 'Q. www.naver.com을 쳤을 때 생기는 과정, 그리고 DNS까지'],
])

const pdfPath = process.argv[2]

if (!pdfPath) {
  console.error('Usage: npm run import:network -- "/path/to/CS - 3. 네트워크.pdf"')
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
  console.error('No network sections were extracted from the PDF.')
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
      name: '네트워크',
      slug: 'networks',
      description: 'TCP/IP, HTTP, DNS 등 컴퓨터 네트워킹 개념',
      icon: '🌐',
    },
    { onConflict: 'slug' }
  )
  .select('id')
  .single()

if (categoryError) {
  console.error('Failed to upsert network category.')
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

console.log(`Imported ${payload.length} network articles.`)

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
  const outDir = mkdtempSync(join(tmpdir(), 'cs-network-'))
  const outPath = join(outDir, 'network.txt')
  execFileSync('pdftotext', ['-layout', path, outPath], { stdio: 'ignore' })
  return readFileSync(outPath, 'utf8')
}

function buildArticles(rawText) {
  const lines = rawText
    .replace(/\f/g, '\n\f\n')
    .split(/\r?\n/)
    .map(cleanLine)

  const contentStart = lines.findIndex((line, index) => (
    index > 700 && line === sections[0][0]
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

    const section = sections.find(([title]) => title === boundary.title)
    const content = toMarkdown(boundary.title, bodyLines)

    return {
      title: boundary.title,
      slug: section[1],
      summary: summarize(bodyLines),
      content,
      tags: ['네트워크', ...inferTags(boundary.title)],
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
  if (title.includes('TCP') || title.includes('UDP') || title.includes('전송')) tags.push('TCP/UDP')
  if (title.includes('HTTP') || title.includes('REST') || title.includes('CORS')) tags.push('HTTP')
  if (title.includes('IP') || title.includes('라우팅') || title.includes('ARP')) tags.push('IP')
  if (title.includes('TLS') || title.includes('HTTPS') || title.includes('XSS') || title.includes('CSRF')) tags.push('보안')
  if (title.includes('쿠키') || title.includes('스토리지') || title.includes('로그인') || title.includes('토큰')) tags.push('인증')
  if (title.includes('LAN') || title.includes('토폴로지') || title.includes('장치')) tags.push('네트워크 장치')
  if (title.includes('DNS')) tags.push('DNS')
  if (title.includes('트래픽') || title.includes('과부하')) tags.push('트래픽')
  return tags
}
