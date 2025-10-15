import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
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
        remove(name: string, options: CookieOptions) {
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

  // Get authenticated user - validates the session server-side
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/callback',
    '/onboarding',
    '/admin', // Admin login page
  ]

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route)

  // If not logged in and trying to access protected route
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If logged in but not on onboarding/auth pages, check if profile is completed
  if (user && !isPublicRoute && pathname !== '/onboarding') {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('profile_completed, role')
      .eq('user_id', user.id)
      .single()

    // Check if trying to access admin routes
    if (pathname.startsWith('/admin/dashboard')) {
      if (!profile || (profile as any).role !== 'admin') {
        // Not an admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // If profile doesn't exist or isn't completed, redirect to onboarding
    if (!profile || !(profile as any).profile_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // If we're on the auth callback page, let the page component handle it
  if (pathname === '/auth/callback') {
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
