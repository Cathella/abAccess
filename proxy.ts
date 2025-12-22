import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/welcome',
  '/sign-in',
  '/verify-otp',
  '/create-pin',
  '/onboarding',
]

// Routes that should redirect to welcome if already authenticated
const AUTH_ROUTES = ['/sign-in', '/verify-otp', '/create-pin']

/**
 * Check if the given path matches any of the public routes
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * Check if the given path is an auth route (sign in flow)
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow all access (development safety)
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl.includes('your_supabase_url_here') ||
      supabaseAnonKey.includes('your_supabase_anon_key_here')) {
    return NextResponse.next()
  }

  // Update session and get user
  const { user, response } = await updateSession(request)

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // If user is not authenticated and trying to access protected routes, redirect to welcome
  if (!user && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/welcome'
    // Preserve the original destination for post-login redirect
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
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
     * - Static asset extensions
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
