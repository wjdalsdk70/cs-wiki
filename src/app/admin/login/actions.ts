'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isValidAdminCredentials,
} from '@/lib/adminAuth'

export type LoginState = {
  error: string | null
}

export async function loginAdmin(_: LoginState, formData: FormData): Promise<LoginState> {
  const id = String(formData.get('id') ?? '')
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/admin')

  if (!isValidAdminCredentials(id, password)) {
    return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })

  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
  redirect('/admin/login')
}
