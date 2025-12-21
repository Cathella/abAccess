# Supabase Client Configuration

This directory contains the Supabase client configuration for ABA Access, with full TypeScript type safety using our custom database types.

## Files

### `client.ts` - Browser Client
Use this client in client-side components (marked with `"use client"`).

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()

  // Type-safe database operations
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', '+250123456789')
    .single()

  // data is fully typed as Database['public']['Tables']['users']['Row']
  console.log(data?.name)
}
```

### `server.ts` - Server Client
Use this client in Server Components, Route Handlers, and Server Actions.

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function MyServerComponent() {
  const supabase = await createClient()

  // Type-safe database operations
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)

  // data is fully typed as Database['public']['Tables']['packages']['Row'][]
  return <div>{data?.map(pkg => pkg.name)}</div>
}
```

### `middleware.ts` - Session Management
Provides utilities for managing auth sessions in Next.js middleware.

**Exported Functions:**

- `createMiddlewareClient(request)` - Creates a Supabase client for middleware with proper cookie handling
- `updateSession(request)` - Refreshes the auth session and returns user info

This is used in the root `middleware.ts` file to protect routes and manage authentication.

## Environment Variables

Make sure these environment variables are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Type Safety

All clients are configured with the `Database` type from `@/types/database`, providing:

- **Autocomplete** for table names, column names, and enum values
- **Type checking** for insert, update, and select operations
- **Intellisense** for relationships and joins
- **Compile-time errors** for invalid queries

## Usage Examples

### Insert Data
```tsx
const { data, error } = await supabase
  .from('dependents')
  .insert({
    user_id: userId,
    name: 'John Doe',
    relationship: 'child', // Type-safe enum value
    date_of_birth: '2020-01-01',
    gender: 'male', // Type-safe enum value
  })
  .select()
  .single()
```

### Update Data
```tsx
const { data, error } = await supabase
  .from('user_packages')
  .update({
    visits_remaining: 5,
    status: 'active', // Type-safe enum value
  })
  .eq('id', packageId)
  .select()
  .single()
```

### Query with Filters
```tsx
const { data, error } = await supabase
  .from('visits')
  .select('*')
  .eq('status', 'completed')
  .gte('visit_date', '2024-01-01')
  .order('visit_date', { ascending: false })
```

### Joins (Relations)
```tsx
const { data, error } = await supabase
  .from('user_packages')
  .select(`
    *,
    package:packages(*),
    visits(*)
  `)
  .eq('user_id', userId)
```

## Route Protection

The root `middleware.ts` automatically protects routes based on authentication status:

### Public Routes (no auth required):
- `/welcome` - Landing page
- `/sign-in` - Phone number entry
- `/verify-otp` - OTP verification
- `/create-pin` - PIN creation
- `/onboarding` - User onboarding

### Protected Routes (auth required):
- All other routes (dashboard, packages, visits, wallet, etc.)
- Unauthenticated users are redirected to `/welcome`
- The original destination is preserved in the `redirectTo` query parameter

### Auth Route Behavior:
- Users already authenticated cannot access `/sign-in`, `/verify-otp`, or `/create-pin`
- They are automatically redirected to `/dashboard`

### Development Safety:
- If Supabase environment variables are not configured, all routes are accessible
- This prevents blocking development when backend is not set up

## Best Practices

1. **Always use the appropriate client** - Browser client for client components, server client for server components
2. **Handle errors** - Always check and handle the `error` object returned from queries
3. **Use type inference** - Let TypeScript infer types from your queries for maximum type safety
4. **Leverage RLS** - Configure Row Level Security policies in Supabase for data security
5. **Cache wisely** - Use Next.js caching strategies with server-side queries
6. **Session management** - Middleware automatically refreshes sessions; no manual refresh needed
