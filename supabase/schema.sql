-- CS Wiki Schema

-- Categories table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz default now() not null
);

-- Articles table
create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null default '',
  summary text,
  category_id uuid references categories(id) on delete set null,
  tags text[] default '{}',
  is_published boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_updated_at on articles;
create trigger articles_updated_at
  before update on articles
  for each row execute function update_updated_at();

-- Full-text search index
create index if not exists articles_fts on articles
  using gin(to_tsvector('english', title || ' ' || coalesce(summary, '') || ' ' || content));

-- Seed categories
insert into categories (name, slug, description, icon) values
  ('자료구조', 'data-structures', '배열, 링크드리스트, 트리, 그래프 등 데이터를 구조화하는 방법', '🗃️'),
  ('알고리즘', 'algorithms', '정렬, 탐색, 동적 프로그래밍 등 문제 해결 알고리즘', '⚙️'),
  ('운영체제', 'operating-systems', '프로세스, 스레드, 메모리 관리, 파일 시스템', '🖥️'),
  ('네트워크', 'networks', 'TCP/IP, HTTP, DNS 등 컴퓨터 네트워킹 개념', '🌐'),
  ('데이터베이스', 'databases', '관계형 DB, SQL, 인덱싱, 트랜잭션', '🗄️'),
  ('컴퓨터구조', 'computer-architecture', 'CPU, 메모리 계층, 명령어 집합 구조', '🔧'),
  ('개발', 'languages-compilers', '프로그래밍 언어 이론, 파싱, 최적화', '📝'),
  ('보안', 'security', '암호화, 인증, 취약점, 보안 프로토콜', '🔐')
on conflict (slug) do nothing;

-- RLS Policies (공개 읽기, 인증된 사용자만 쓰기)
alter table categories enable row level security;
alter table articles enable row level security;

drop policy if exists "Public read categories" on categories;
create policy "Public read categories" on categories
  for select using (true);

drop policy if exists "Public read published articles" on articles;
create policy "Public read published articles" on articles
  for select using (is_published = true);

drop policy if exists "Authenticated users can manage articles" on articles;
create policy "Authenticated users can manage articles" on articles
  for all using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can manage categories" on categories;
create policy "Authenticated users can manage categories" on categories
  for all using (auth.role() = 'authenticated');
