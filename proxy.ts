import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES } from '@/lib/routes'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Public routes that don't require auth
  const publicRoutes = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.SIGNUP]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Protected routes that require auth
  const protectedRoutes = [ROUTES.DASHBOARD, ROUTES.ADMIN, ROUTES.DEVELOPER, ROUTES.PROFILE]
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
  }

  // Redirect authenticated users from auth pages
  if ((pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP) && user) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}