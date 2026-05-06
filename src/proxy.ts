import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/adminAuth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value

  if (await isValidAdminSession(sessionToken)) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('next', pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
