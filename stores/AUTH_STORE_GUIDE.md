# AuthStore Usage Guide

## Overview

The `authStore` manages all authentication state for the ABA Access app using Zustand with localStorage persistence.

## State Structure

```typescript
interface AuthState {
  // User data
  user: User | null

  // Login flow
  phoneNumber: string
  isPhoneValid: boolean

  // PIN attempts tracking
  pinAttempts: number
  isPinLocked: boolean
  maxAttempts: number  // Always 3

  // Loading states
  isLoading: boolean

  // Session
  session: Session | null
  isAuthenticated: boolean

  // Actions (see below)
}
```

## Actions

### Phone Number Management

#### `setPhoneNumber(phone: string)`
- Sets the phone number for login
- **Automatically resets** PIN attempts and unlocks when phone changes
- Use when user enters/changes phone number

```typescript
const { setPhoneNumber } = useAuthStore()
setPhoneNumber('+256781234567')
```

#### `setPhoneValid(valid: boolean)`
- Marks if the phone number format is valid
- Use after validation with `isValidUgandanPhone()`

```typescript
const { setPhoneValid } = useAuthStore()
const isValid = isValidUgandanPhone(phone)
setPhoneValid(isValid)
```

### PIN Attempt Tracking

#### `incrementPinAttempts()`
- Increments failed PIN attempts
- **Automatically locks** when attempts reach maxAttempts (3)
- Call after each failed PIN verification

```typescript
const { incrementPinAttempts, pinAttempts, isPinLocked } = useAuthStore()

// After failed login
if (!result.success) {
  incrementPinAttempts()

  if (isPinLocked) {
    console.log('Account locked after 3 attempts')
  } else {
    console.log(`${3 - pinAttempts} attempts remaining`)
  }
}
```

#### `resetPinAttempts()`
- Resets attempts to 0 and unlocks PIN
- Call after successful login
- **Note**: Also auto-called by `setPhoneNumber()` and `signIn()`

```typescript
const { resetPinAttempts } = useAuthStore()
resetPinAttempts()
```

#### `lockPin()`
- Manually locks the PIN (sets attempts to max)
- Use for security actions (e.g., suspicious activity)

```typescript
const { lockPin } = useAuthStore()
lockPin()
```

### Authentication

#### `signIn(user: User, session: Session)`
- Complete sign-in with user and session
- Sets `isAuthenticated = true`
- **Automatically resets** PIN attempts
- Stops loading state

```typescript
const { signIn } = useAuthStore()

const result = await login(phone, pin)
if (result.success) {
  signIn(result.user, result.session)
  router.push('/dashboard')
}
```

#### `signOut()`
- Signs out user
- Clears user and session
- Sets `isAuthenticated = false`
- **Keeps** phoneNumber for "Welcome back" UX
- Resets PIN attempts

```typescript
const { signOut } = useAuthStore()

await signOut()
router.push('/welcome')
```

#### `clearAuth()`
- Complete reset of all auth state
- Clears **everything** including phoneNumber
- Use for "Sign in as different user"

```typescript
const { clearAuth } = useAuthStore()
clearAuth()
```

### User & Session

#### `setUser(user: User | null)`
- Updates user data
- Automatically sets `isAuthenticated` based on user presence

```typescript
const { setUser } = useAuthStore()
setUser(updatedUser)
```

#### `setSession(session: Session | null)`
- Updates session data
- Use when refreshing session

```typescript
const { setSession } = useAuthStore()
setSession(newSession)
```

#### `setAuthenticated(auth: boolean)`
- Manually set authentication status
- Usually handled automatically by other actions

```typescript
const { setAuthenticated } = useAuthStore()
setAuthenticated(true)
```

#### `setLoading(isLoading: boolean)`
- Sets loading state for UI feedback

```typescript
const { setLoading } = useAuthStore()

setLoading(true)
// ... async operation
setLoading(false)
```

## Persistence (localStorage)

### What Gets Persisted
✅ **user** - For "Welcome back, [name]" display
✅ **phoneNumber** - To remember last login phone

### What Does NOT Get Persisted
❌ **pinAttempts** - Reset on app restart (security)
❌ **isPinLocked** - Reset on app restart (gives user second chance)
❌ **isAuthenticated** - Always check fresh via Supabase
❌ **session** - Always fetch fresh via Supabase
❌ **isLoading** - Always starts false
❌ **isPhoneValid** - Revalidate on each use

### Why This Design?

**Security**: PIN attempts reset on app restart, preventing permanent lockouts while maintaining session security.

**UX**: Persisting phone number lets returning users quickly login without re-entering their number.

**Reliability**: Session and auth status are always fresh from Supabase, preventing stale auth states.

## Usage Examples

### Example 1: Phone Entry Screen

```typescript
'use client'

import { useAuthStore } from '@/stores/authStore'
import { isValidUgandanPhone, checkUserExists } from '@/lib/supabase/auth'

export default function PhoneEntryPage() {
  const { phoneNumber, setPhoneNumber, setPhoneValid, setLoading } = useAuthStore()
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate format
    const isValid = isValidUgandanPhone(phoneNumber)
    setPhoneValid(isValid)

    if (!isValid) {
      setError('Invalid phone number format')
      return
    }

    // Check if user exists
    setLoading(true)
    const { exists } = await checkUserExists(phoneNumber)
    setLoading(false)

    if (!exists) {
      router.push('/sign-up')
    } else {
      router.push('/enter-pin')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="078 123 4567"
      />
      {error && <p>{error}</p>}
      <button type="submit">Continue</button>
    </form>
  )
}
```

### Example 2: PIN Entry Screen

```typescript
'use client'

import { useAuthStore } from '@/stores/authStore'
import { login } from '@/lib/supabase/auth'

export default function EnterPinPage() {
  const {
    phoneNumber,
    pinAttempts,
    isPinLocked,
    maxAttempts,
    incrementPinAttempts,
    signIn,
    setLoading,
    isLoading
  } = useAuthStore()

  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (isPinLocked) {
      setError('Account locked. Please try again later.')
      return
    }

    setLoading(true)
    const result = await login(phoneNumber, pin)
    setLoading(false)

    if (result.success) {
      // Success - sign in
      signIn(result.user, result.session)
      router.push('/dashboard')
    } else {
      // Failed - increment attempts
      incrementPinAttempts()

      const attemptsLeft = maxAttempts - (pinAttempts + 1)

      if (isPinLocked) {
        setError('Account locked after 3 failed attempts')
      } else if (attemptsLeft > 0) {
        setError(`Wrong PIN. ${attemptsLeft} attempts remaining`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Enter PIN</h1>
      <p>for {phoneNumber}</p>

      {isPinLocked && (
        <div className="alert alert-error">
          Account locked. Try again in 30 minutes.
        </div>
      )}

      <PinInput
        value={pin}
        onChange={setPin}
        disabled={isPinLocked || isLoading}
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={isPinLocked || isLoading}>
        {isLoading ? 'Verifying...' : 'Sign In'}
      </button>
    </form>
  )
}
```

### Example 3: Welcome Back Screen

```typescript
'use client'

import { useAuthStore } from '@/stores/authStore'

export default function WelcomePage() {
  const { user, phoneNumber } = useAuthStore()

  return (
    <div>
      <h1>Welcome to ABA Access</h1>

      {user && (
        <p>Welcome back, {user.name}!</p>
      )}

      {phoneNumber && (
        <p>Last login: {phoneNumber}</p>
      )}

      <button onClick={() => router.push('/enter-pin')}>
        Sign In
      </button>
    </div>
  )
}
```

### Example 4: Sign Out

```typescript
'use client'

import { useAuthStore } from '@/stores/authStore'
import { signOut as supabaseSignOut } from '@/lib/supabase/auth'

export default function ProfilePage() {
  const { signOut } = useAuthStore()

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabaseSignOut()

    // Clear auth store
    signOut()

    // Redirect to welcome
    router.push('/welcome')
  }

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  )
}
```

## Security Features

### PIN Attempt Limiting
- Maximum 3 attempts per session
- Auto-locks after 3 failed attempts
- Resets when:
  - App restarts (fresh chance)
  - Phone number changes
  - Successful login

### Automatic Resets
- **Phone change** → Resets attempts (new login context)
- **Successful login** → Resets attempts (security baseline)
- **App restart** → Resets attempts (prevents permanent lockout)

### No Persistence of Sensitive Data
- PIN attempts not persisted (security)
- Lock status not persisted (user-friendly)
- Session not persisted (always fresh)
- Auth status not persisted (always verified)

## Best Practices

### DO ✅
- Call `incrementPinAttempts()` after **every** failed login
- Check `isPinLocked` before allowing login attempts
- Use `signOut()` to preserve phone number for UX
- Use `clearAuth()` only for "sign in as different user"
- Call `setPhoneNumber()` when phone changes (auto-resets attempts)

### DON'T ❌
- Don't manually set `pinAttempts` (use actions)
- Don't persist sensitive state manually
- Don't forget to check `isPinLocked` before login
- Don't persist sessions in other stores
- Don't bypass the increment/reset pattern

## TypeScript Usage

```typescript
import { useAuthStore } from '@/stores/authStore'

// In component
const phoneNumber = useAuthStore((state) => state.phoneNumber)
const isPinLocked = useAuthStore((state) => state.isPinLocked)

// Or destructure
const { user, isAuthenticated, signIn } = useAuthStore()

// With selectors for performance
const isLocked = useAuthStore((state) => state.isPinLocked)
```

## Testing

```typescript
// Reset store for testing
const { clearAuth } = useAuthStore.getState()
clearAuth()

// Check state
const state = useAuthStore.getState()
expect(state.pinAttempts).toBe(0)
expect(state.isPinLocked).toBe(false)

// Simulate failed attempts
const { incrementPinAttempts } = useAuthStore.getState()
incrementPinAttempts()
incrementPinAttempts()
incrementPinAttempts()

const lockedState = useAuthStore.getState()
expect(lockedState.isPinLocked).toBe(true)
```

---

**Version**: 1.0.0
**Last Updated**: 2025-12-22
