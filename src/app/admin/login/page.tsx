import LoginForm from './LoginForm'

type Props = {
  searchParams: Promise<{ next?: string }>
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next = '/admin' } = await searchParams

  return (
    <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center">
      <div className="w-full max-w-sm border border-white/[0.07] rounded-xl bg-white/[0.03] p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
          <p className="text-white/30 text-sm mt-1">문서 관리는 로그인 후 사용할 수 있습니다.</p>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  )
}
