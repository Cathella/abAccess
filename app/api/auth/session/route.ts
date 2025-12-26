import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * API Route to manage authentication session cookies
 * POST - Set session cookie
 * DELETE - Clear session cookie
 */

/**
 * POST /api/auth/session
 * Sets the authentication session cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session, user } = body

    if (!session || !user) {
      return NextResponse.json(
        { error: 'Session and user data required' },
        { status: 400 }
      )
    }

    // Create session data to store in cookie
    const sessionData = {
      access_token: session.access_token,
      user_id: user.id,
      expires_at: session.expires_at,
    }

    // Set HTTP-only cookie
    // Note: In production, also set secure: true and sameSite: 'strict'
    const cookieStore = await cookies()
    cookieStore.set('auth-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session cookie error:', error)
    return NextResponse.json(
      { error: 'Failed to set session' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/auth/session
 * Clears the authentication session cookie
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth-session')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session delete error:', error)
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    )
  }
}
