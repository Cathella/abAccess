# useAuth Hook Documentation

## Overview

The `useAuth` hook is a convenience wrapper around the `authStore` that provides a clean API for authentication operations in your components.

## Features

✅ Login with phone + PIN
✅ Logout with automatic redirect
✅ Check if phone number exists
✅ Automatic PIN attempt tracking
✅ Automatic loading states
✅ Integrated with router for redirects

## Import

```typescript
import { useAuth } from "@/hooks/useAuth";
```

## API Reference

### State Properties

```typescript
const {
  user,              // User | null - Current user data
  isAuthenticated,   // boolean - Is user logged in
  isLoading,         // boolean - Is any auth operation in progress
  phoneNumber,       // string - Current/last phone number
  isPinLocked,       // boolean - Is account locked after 3 attempts
  pinAttempts,       // number - Current failed attempt count
} = useAuth();
```

### Action Methods

#### `login(phone: string, pin: string)`

Login with phone number and PIN.

**Parameters:**
- `phone` - Phone number (any format: "0781234567", "+256781234567", etc.)
- `pin` - 4-digit PIN

**Returns:**
```typescript
Promise<{
  success: boolean;
  user?: User;
  error?: string;
}>
```

**Behavior:**
- Sets `isLoading = true` during operation
- Checks if PIN is locked before attempting
- Calls auth service to verify credentials
- On success: Updates store, resets PIN attempts, returns user
- On failure: Increments PIN attempts, returns error
- Auto-locks after 3 failed attempts

**Example:**
```typescript
const { login, isLoading } = useAuth();

const handleLogin = async () => {
  const result = await login(phoneNumber, pin);

  if (result.success) {
    console.log("Login successful!", result.user);
    // Router automatically handles redirect in hook
  } else {
    console.error("Login failed:", result.error);
    // Show error to user
  }
};
```

#### `logout()`

Logout current user and redirect to welcome page.

**Returns:**
```typescript
Promise<void>
```

**Behavior:**
- Sets `isLoading = true` during operation
- Calls Supabase signOut
- Clears store (keeps phoneNumber for UX)
- Redirects to `/welcome`
- Even on error, still redirects (safe logout)

**Example:**
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User is now at /welcome page
};
```

#### `checkPhone(phone: string)`

Check if a phone number has an existing account.

**Parameters:**
- `phone` - Phone number to check

**Returns:**
```typescript
Promise<{
  exists: boolean;
  error?: string;
}>
```

**Behavior:**
- Queries database for phone number
- Returns `exists: true` if account found
- Returns `exists: false` if no account
- Handles errors gracefully

**Example:**
```typescript
const { checkPhone } = useAuth();

const handlePhoneSubmit = async () => {
  const result = await checkPhone(phoneNumber);

  if (result.exists) {
    router.push('/enter-pin');
  } else {
    router.push('/sign-up');
  }
};
```

## Usage Examples

### Example 1: Phone Entry Page

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isValidUgandanPhone } from "@/lib/supabase/auth";
import { useAuthStore } from "@/stores/authStore";

export default function PhoneEntryPage() {
  const router = useRouter();
  const { checkPhone, isLoading } = useAuth();
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
  const setPhoneValid = useAuthStore((state) => state.setPhoneValid);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate format
    const isValid = isValidUgandanPhone(phone);
    setPhoneValid(isValid);

    if (!isValid) {
      setError("Invalid phone number format");
      return;
    }

    // Save phone to store
    setPhoneNumber(phone);

    // Check if account exists
    const result = await checkPhone(phone);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.exists) {
      // Account exists - go to PIN screen
      router.push("/enter-pin");
    } else {
      // No account - go to signup
      router.push("/sign-up");
    }
  };

  return (
    <div>
      <h1>Enter Phone Number</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="078 123 4567"
          disabled={isLoading}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
```

### Example 2: PIN Entry Page

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function EnterPinPage() {
  const router = useRouter();
  const {
    phoneNumber,
    isPinLocked,
    pinAttempts,
    login,
    isLoading
  } = useAuth();

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const maxAttempts = 3;
  const attemptsLeft = maxAttempts - pinAttempts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isPinLocked) {
      setError("Account locked. Please try again later.");
      return;
    }

    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    const result = await login(phoneNumber, pin);

    if (result.success) {
      // Success - login handles everything
      router.push("/dashboard");
    } else {
      // Show error
      setError(result.error || "Login failed");
      setPin(""); // Clear PIN input
    }
  };

  return (
    <div>
      <h1>Enter PIN</h1>
      <p>for {phoneNumber}</p>

      {isPinLocked && (
        <div className="alert alert-error">
          Account locked after 3 failed attempts.
          Please try again in 30 minutes.
        </div>
      )}

      {!isPinLocked && pinAttempts > 0 && (
        <div className="alert alert-warning">
          {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="••••"
          disabled={isPinLocked || isLoading}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={isPinLocked || isLoading}>
          {isLoading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
```

### Example 3: Dashboard with Logout

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Phone: {user?.phone}</p>

      <button onClick={logout} disabled={isLoading}>
        {isLoading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
```

### Example 4: Protected Component

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedComponent() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/welcome");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome {user?.name}</p>
    </div>
  );
}
```

### Example 5: Welcome Back Screen

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const { user, phoneNumber } = useAuth();

  return (
    <div>
      <h1>Welcome to ABA Access</h1>

      {user && (
        <div className="welcome-back">
          <p>Welcome back, {user.name}!</p>
          <button onClick={() => router.push("/enter-pin")}>
            Continue as {phoneNumber}
          </button>
        </div>
      )}

      <button onClick={() => router.push("/phone-entry")}>
        Sign In
      </button>

      <button onClick={() => router.push("/sign-up")}>
        Create Account
      </button>
    </div>
  );
}
```

## How it Works

### Login Flow

```
1. User calls login(phone, pin)
   ↓
2. Hook checks if PIN is locked
   ↓ (not locked)
3. Hook sets isLoading = true
   ↓
4. Hook calls auth service (lib/supabase/auth.ts)
   ↓
5a. Success:
    - signInStore(user, session) - updates store
    - Resets PIN attempts to 0
    - Sets isLoading = false
    - Returns { success: true, user }

5b. Failure:
    - incrementPinAttempts() - increments counter
    - Auto-locks if attempts >= 3
    - Sets isLoading = false
    - Returns { success: false, error }
```

### Logout Flow

```
1. User calls logout()
   ↓
2. Hook sets isLoading = true
   ↓
3. Hook calls signOutAuth() - clears Supabase session
   ↓
4. Hook calls signOutStore() - clears auth store
   ↓
5. Hook sets isLoading = false
   ↓
6. Router redirects to /welcome
```

### CheckPhone Flow

```
1. User calls checkPhone(phone)
   ↓
2. Hook calls checkUserExists(phone)
   ↓
3. Supabase queries users table
   ↓
4a. Found: Returns { exists: true }
4b. Not found: Returns { exists: false }
4c. Error: Returns { exists: false, error }
```

## Integration with AuthStore

The `useAuth` hook is a wrapper around `authStore` that:

1. **Selects state** using Zustand selectors
2. **Calls store actions** (signIn, signOut, etc.)
3. **Integrates auth functions** from lib/supabase/auth.ts
4. **Handles loading states** automatically
5. **Manages routing** for logout

**Direct Store Access:**
```typescript
// Still works if you need it
import { useAuthStore } from "@/stores/authStore";
const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
```

**Hook Wrapper:**
```typescript
// Cleaner API for common operations
import { useAuth } from "@/hooks/useAuth";
const { login, logout, checkPhone } = useAuth();
```

## Error Handling

All methods handle errors gracefully:

```typescript
// Login errors
const result = await login(phone, pin);
if (!result.success) {
  // result.error contains user-friendly message:
  // - "Account locked after 3 failed attempts. Please try again later."
  // - "Account not found"
  // - "Wrong PIN"
  // - "An error occurred"
}

// CheckPhone errors
const result = await checkPhone(phone);
if (result.error) {
  // result.error contains error message
  // result.exists will be false
}

// Logout always succeeds (redirects even on error)
await logout(); // Always goes to /welcome
```

## Best Practices

### DO ✅

- Use `useAuth()` for component-level auth operations
- Check `isPinLocked` before showing PIN input
- Display `pinAttempts` to show remaining attempts
- Handle loading states with `isLoading`
- Show user-friendly error messages from `result.error`

### DON'T ❌

- Don't call auth functions directly from components (use hook)
- Don't ignore `isPinLocked` state
- Don't forget to check `result.success`
- Don't manually manipulate auth state (use hook methods)

## TypeScript Types

```typescript
interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  phoneNumber: string;
  isPinLocked: boolean;
  pinAttempts: number;

  // Actions
  login: (phone: string, pin: string) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
  logout: () => Promise<void>;
  checkPhone: (phone: string) => Promise<{
    exists: boolean;
    error?: string;
  }>;
}
```

## Status

✅ **COMPLETE** - All required functionality implemented

### Implemented Features
- ✅ Login function with PIN attempt tracking
- ✅ Logout function with redirect
- ✅ CheckPhone function
- ✅ State selectors (user, isAuthenticated, isLoading)
- ✅ PIN lock checking
- ✅ Automatic error handling
- ✅ Router integration

---

**Version**: 1.0.0
**Last Updated**: 2025-12-22
