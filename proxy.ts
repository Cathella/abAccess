import { type NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/welcome',
  '/sign-in',
  '/verify-otp',
  '/create-pin',
  '/enter-pin',
  '/forgot-pin',
  '/onboarding',
  '/register',
]

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/packages',
  '/my-packages',
  '/visits',
  '/wallet',
  '/profile',
  '/family',
  '/notifications',
]

// Routes that should redirect to welcome if already authenticated
const AUTH_ROUTES = ['/sign-in', '/verify-otp', '/create-pin', '/enter-pin']

// Routes that authenticated users can access (success page)
const AUTH_SUCCESS_ROUTES = ['/register/success']

/**
 * Check if the given path matches any of the public routes
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * Check if the given path is a protected route
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * Check if the given path is an auth route (sign in flow)
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * Proxy function to protect routes and handle authentication
 * Runs on the server before any page is rendered
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth session from cookies
  const authCookie = request.cookies.get('auth-session')
  const isAuthenticated = !!authCookie?.value

  // Root path redirects to welcome (handled by app/page.tsx), allow it through
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Protect authenticated routes
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    // User trying to access protected route without auth
    const url = new URL('/welcome', request.url)
    return NextResponse.redirect(url)
  }

  // Allow authenticated users to access success page (must check BEFORE public route redirect)
  if (AUTH_SUCCESS_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages (except welcome and success pages)
  if (isPublicRoute(pathname) && isAuthenticated && pathname !== '/welcome' && !AUTH_SUCCESS_ROUTES.some(route => pathname.startsWith(route))) {
    // Already logged in, redirect to dashboard
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  // Validate session data if authenticated
  if (isAuthenticated && authCookie?.value) {
    try {
      const sessionData = JSON.parse(authCookie.value)

      // Check if session has expired
      if (sessionData.expires_at && sessionData.expires_at < Date.now()) {
        // Session expired, clear cookie and redirect
        const response = NextResponse.redirect(new URL('/welcome', request.url))
        response.cookies.delete('auth-session')
        return response
      }
    } catch (error) {
      // Invalid session cookie, clear it
      const response = isProtectedRoute(pathname)
        ? NextResponse.redirect(new URL('/welcome', request.url))
        : NextResponse.next()
      response.cookies.delete('auth-session')
      return response
    }
  }

  return NextResponse.next()
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
