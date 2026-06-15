import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.url ? new URL(request.url) : { pathname: '' }

  const method = request.method
  const isWriteMethod = method === 'POST' || method === 'PUT' || method === 'DELETE'

  const protectedWritePaths = ['/api/profile', '/api/education', '/api/experience', '/api/projects', '/api/blog', '/api/skills', '/api/upload']
  const isProtectedWritePath = protectedWritePaths.some(path => pathname.startsWith(path))

  const adminOnlyPaths = ['/api/contact']
  const isAdminOnlyPath = adminOnlyPaths.some(path => pathname.startsWith(path))
  const isAdminOnlyMethod = method === 'GET' || method === 'PUT' || method === 'DELETE'

  const isReplyPath = pathname === '/api/contact/reply'

  const needsAuth = (isWriteMethod && isProtectedWritePath) || (isAdminOnlyPath && isAdminOnlyMethod) || isReplyPath

  if (needsAuth) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      if (!token) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
    } catch {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
