import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

/**
 * Creates a Supabase client for middleware usage
 * Handles cookie management for auth sessions
 */
export function createMiddlewareClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response: supabaseResponse }
}

/**
 * Updates the session and refreshes auth token if needed
 * Returns the user and the response
 */
export async function updateSession(request: NextRequest) {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow access (development safety)
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl.includes('your_supabase_url_here') ||
      supabaseAnonKey.includes('your_supabase_anon_key_here')) {
    return {
      user: null,
      response: NextResponse.next({ request }),
    }
  }

  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session if expired - this is important!
  const { data: { user }, error } = await supabase.auth.getUser()

  return { user, response, error }
}
