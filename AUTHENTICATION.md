# Authentication System

This document explains how authentication works in the ABA Access application.

## Architecture

The application uses a **dual-layer authentication system**:

1. **Server-side protection** via Next.js proxy function (HTTP-only cookies)
2. **Client-side state management** via Zustand + localStorage

### Why Both Layers?

- **Server-side (Proxy)**: Protects routes before pages load, prevents unauthorized access via direct URL navigation
- **Client-side (Zustand)**: Manages UI state, user data, and provides seamless UX

## Authentication Flow

### 1. Login Flow

```
User enters phone number
  ↓
Check if user exists (sign-in/page.tsx)
  ↓
User enters PIN (enter-pin/page.tsx)
  ↓
Verify PIN with bcrypt (lib/supabase/auth.ts)
  ↓
On success:
  ├─ Update Zustand store (hooks/useAuth.ts)
  ├─ Set HTTP-only cookie via API (app/api/auth/session/route.ts)
  └─ Redirect to dashboard
```

### 2. Route Protection

**Server-side (proxy.ts)**:
- Runs before any page renders
- Checks for `auth-session` cookie
- Validates session expiry
- Redirects unauthenticated users to `/welcome`
- Redirects authenticated users away from auth pages

**Client-side (app/(main)/layout.tsx)**:
- Waits for Zustand store hydration
- Checks for user in store
- Shows loading state during hydration
- Provides fallback protection if cookie exists but store is empty

### 3. Session Management

**Session Data Stored**:
```typescript
{
  access_token: string,  // User ID (simplified auth)
  user_id: string,       // User ID
  expires_at: number,    // Timestamp
}
```

**Session Storage**:
- **Cookie**: HTTP-only, secure (production), 7-day expiry
- **LocalStorage** (via Zustand): User object, phone number

**Session Lifetime**:
- Cookie: 7 days (can be renewed)
- Validation: Checked on every request by middleware

### 4. Logout Flow

```
User clicks logout
  ↓
Clear session cookie via API DELETE (hooks/useAuth.ts)
  ↓
Clear Zustand store (keeps phoneNumber for UX)
  ↓
Clear localStorage
  ↓
Redirect to /welcome
```

## Security Features

### Implemented

✅ **PIN Security**
- bcrypt hashing with 10 salt rounds
- No plain-text PIN storage
- 4-digit PIN validation

✅ **Brute Force Protection**
- 3 failed attempts before account lock
- Attempt counter in Zustand store
- Lock state persists until explicitly reset

✅ **Session Security**
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite: 'lax' (CSRF protection)
- Session expiry validation

✅ **Route Protection**
- Server-side middleware protection
- Client-side layout protection (fallback)
- Protected routes require valid session
- Auth pages redirect if already logged in

✅ **Input Validation**
- Ugandan phone number format validation (+256)
- Valid carrier prefix check (70, 74, 75, 76, 77, 78)
- PIN length validation

### Not Yet Implemented

⚠️ **Session Refresh**
- Sessions expire after 7 days
- No automatic refresh before expiry
- User must log in again

⚠️ **Remember Me**
- All sessions are 7 days
- No option for longer/shorter sessions

⚠️ **Rate Limiting**
- No server-side rate limiting on login attempts
- Only client-side attempt counting (can be bypassed)

⚠️ **Account Recovery**
- No "Forgot PIN" flow implementation
- Locked accounts have no recovery method

## Protected Routes

These routes require authentication:
- `/dashboard`
- `/packages`
- `/my-packages`
- `/visits`
- `/wallet`
- `/profile`
- `/family`
- `/notifications`

## Public Routes

These routes are accessible without authentication:
- `/welcome`
- `/sign-in`
- `/enter-pin`
- `/onboarding` (not implemented)
- `/create-pin` (not implemented)
- `/verify-otp` (not implemented)
- `/forgot-pin` (not implemented)

## Files

### Core Auth Files
- `proxy.ts` - Server-side route protection (Next.js proxy function)
- `app/api/auth/session/route.ts` - Session cookie management
- `hooks/useAuth.ts` - Auth hook for components
- `lib/supabase/auth.ts` - Auth business logic
- `stores/authStore.ts` - Zustand state management

### Auth Pages
- `app/(auth)/sign-in/page.tsx` - Phone number entry
- `app/(auth)/enter-pin/page.tsx` - PIN entry
- `app/(auth)/welcome/page.tsx` - Landing page

### Protected Layout
- `app/(main)/layout.tsx` - Protected routes layout

## Troubleshooting

### User stuck on welcome page after login
- Check browser cookies - ensure `auth-session` is set
- Check localStorage - ensure `auth-storage` has user data
- Check Network tab for API call to `/api/auth/session`

### Proxy redirects authenticated user
- Session cookie might be expired
- Session cookie might be malformed
- Check cookie expiry in proxy validation

### User can access protected routes without login
- Proxy function might not be running
- Check `proxy.ts` is in project root
- Check proxy matcher configuration
- Ensure Next.js dev server was restarted

### Store and cookie out of sync
- This can happen if localStorage is cleared but cookie remains
- Current implementation: proxy will allow access, layout might redirect
- Recommendation: Clear both cookie and localStorage together

## Best Practices for Development

1. **Always test with proxy protection**
   - Try accessing `/dashboard` directly while logged out
   - Should redirect to `/welcome`

2. **Test session expiry**
   - Set `expires_at` to past timestamp in cookie
   - Should redirect to `/welcome` on next request

3. **Test logout**
   - Verify cookie is cleared
   - Verify localStorage is cleared
   - Verify redirect to `/welcome`

4. **Don't bypass proxy in development**
   - It's tempting to disable it, but keep it active
   - This ensures you catch auth issues early

## Future Improvements

1. **Implement server-side rate limiting**
   - Use Redis or database to track attempts
   - Implement IP-based rate limiting

2. **Add session refresh**
   - Refresh token before expiry
   - Extend session on activity

3. **Implement account recovery**
   - OTP-based PIN reset
   - Security questions
   - Admin-assisted recovery

4. **Add biometric authentication**
   - Face ID / Touch ID support
   - PIN as fallback

5. **Implement proper JWT tokens**
   - Replace fake sessions with real JWT
   - Add token refresh mechanism
   - Add token revocation

6. **Add multi-device session management**
   - Track active sessions
   - Allow users to revoke sessions
   - Notify on new login

## Notes

- Current implementation uses simplified sessions (user ID as token)
- Production apps should use proper JWT tokens with signing
- Consider migrating to Supabase Auth for full-featured auth system
