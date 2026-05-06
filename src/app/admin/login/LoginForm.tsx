'use client'

import { useActionState } from 'react'
import { loginAdmin, type LoginState } from './actions'

const initialState: LoginState = {
  error: null,
}

type Props = {
  next: string
}

export default function LoginForm({ next }: Props) {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wide">
          ID
        </label>
        <input
          required
          name="id"
          autoComplete="username"
          className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/90 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] placeholder-white/20 transition-all"
          placeholder="관리자 ID"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wide">
          Password
        </label>
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/90 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] placeholder-white/20 transition-all"
          placeholder="비밀번호"
        />
      </div>

      {state.error && (
        <p className="text-red-400/80 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 transition-all shadow-lg shadow-indigo-500/20"
      >
        {pending ? '확인 중...' : '로그인'}
      </button>
    </form>
  )
}
