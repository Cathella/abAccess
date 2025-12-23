# Types Documentation

## Overview

The ABA Access application uses a dual-type system:
1. **Database Types** (`types/database.ts`) - Direct mapping to Supabase schema
2. **Application Types** (`types/index.ts`) - User-facing types for the application

## Type System Architecture

```
┌─────────────────┐
│  Database       │
│  (Supabase)     │
│  - name         │
│  - pin          │
└────────┬────────┘
         │
         ↓ (mapper)
┌─────────────────┐
│  Application    │
│  Types          │
│  - firstName    │
│  - lastName     │
│  - pinHash      │
└─────────────────┘
```

## User Type

### Application Type (types/index.ts)

```typescript
export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  pinHash: string; // Hashed PIN, never plain
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Fields:**
- `id` - Unique user identifier (UUID)
- `phone` - Phone number in international format (+256...)
- `firstName` - User's first name
- `lastName` - User's last name
- `pinHash` - Bcrypt hashed PIN (never stored or transmitted as plain text)
- `avatar` - Optional avatar URL
- `createdAt` - ISO timestamp when user was created
- `updatedAt` - ISO timestamp when user was last updated

### Database Type (types/database.ts)

```typescript
Row: {
  id: string;
  phone: string;
  name: string;        // Single name field
  pin: string;         // Bcrypt hash
  avatar: string | null;
  created_at: string;
  updated_at: string;
}
```

**Mapping:**
- Database `name` → Split into Application `firstName` + `lastName`
- Database `pin` → Renamed to Application `pinHash` (both are hashed)
- Database `created_at` → Application `createdAt`
- Database `updated_at` → Application `updatedAt`

## LoginResult Type

```typescript
export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}
```

**Usage:**
```typescript
const result: LoginResult = await login(phone, pin);

if (result.success) {
  console.log("Logged in:", result.user);
} else {
  console.error("Error:", result.error);
}
```

## Type Mapping

### Mapper Location
`lib/mappers/userMapper.ts`

### Functions

#### `mapDatabaseUserToUser(dbUser: DatabaseUser): User`

Converts database user to application User type.

```typescript
// Database user (from Supabase)
const dbUser = {
  id: "123",
  phone: "+256781234567",
  name: "John Doe",
  pin: "$2b$10$...", // Bcrypt hash
  avatar: null,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
};

// Convert to application User
const user = mapDatabaseUserToUser(dbUser);
// {
//   id: "123",
//   phone: "+256781234567",
//   firstName: "John",
//   lastName: "Doe",
//   pinHash: "$2b$10$...",
//   avatar: undefined,
//   createdAt: "2025-01-01T00:00:00Z",
//   updatedAt: "2025-01-01T00:00:00Z"
// }
```

**Name Splitting Logic:**
- Splits on whitespace
- First word → `firstName`
- Remaining words → `lastName`
- Handles single names (lastName = "")

#### `mapUserToDatabase(user): DatabaseInsert`

Converts application user data to database insert format.

```typescript
// Application data
const userData = {
  phone: "+256781234567",
  firstName: "John",
  lastName: "Doe",
  pinHash: "$2b$10$...", // Already hashed
  avatar: "https://..."
};

// Convert to database format
const dbInsert = mapUserToDatabase(userData);
// {
//   phone: "+256781234567",
//   name: "John Doe",
//   pin: "$2b$10$...",
//   avatar: "https://..."
// }
```

#### `getUserFullName(user: User): string`

Helper to get full name from User.

```typescript
const user = {
  firstName: "John",
  lastName: "Doe",
  // ... other fields
};

const fullName = getUserFullName(user); // "John Doe"
```

## Usage in Code

### In Authentication (lib/supabase/auth.ts)

The auth module automatically maps database users to application Users:

```typescript
import { login } from '@/lib/supabase/auth';

const result = await login(phone, pin);
// result.user is already in Application User format
// with firstName, lastName, pinHash
```

**Internal flow:**
```
1. Query database → gets DatabaseUser (with "name" and "pin")
2. Verify PIN hash
3. Map to Application User → mapDatabaseUserToUser()
4. Return User with firstName/lastName/pinHash
```

### In Components

Always use the Application `User` type:

```typescript
import { User } from '@/types';

interface Props {
  user: User; // Application type, not database type
}

export default function UserProfile({ user }: Props) {
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.phone}</p>
      {/* user.pinHash is available but should never be displayed */}
    </div>
  );
}
```

### In Stores (stores/authStore.ts)

The authStore uses the Application `User` type:

```typescript
interface AuthState {
  user: User | null; // Application User type
  // ...
}
```

### Creating New Users

When creating a user (signup flow):

```typescript
import { hashPin } from '@/lib/supabase/auth';
import { mapUserToDatabase } from '@/lib/mappers/userMapper';
import { createClient } from '@/lib/supabase/client';

// Hash the PIN first
const pinHash = await hashPin(pin);

// Prepare user data
const userData = {
  phone: formattedPhone,
  firstName: "John",
  lastName: "Doe",
  pinHash,
  avatar: avatarUrl
};

// Convert to database format
const dbData = mapUserToDatabase(userData);

// Insert into Supabase
const supabase = createClient();
const { data, error } = await supabase
  .from('users')
  .insert(dbData)
  .select()
  .single();

// Map response back to Application User
const user = mapDatabaseUserToUser(data);
```

## Security Considerations

### PIN/PinHash Field

**CRITICAL:** The `pinHash` field contains a bcrypt hash, NOT a plain text PIN.

❌ **NEVER DO THIS:**
```typescript
// WRONG - Setting plain text PIN
const user = {
  pinHash: "1234" // WRONG!
};

// WRONG - Displaying PIN hash
<p>PIN: {user.pinHash}</p> // WRONG!
```

✅ **CORRECT:**
```typescript
// CORRECT - Hash before storing
import { hashPin } from '@/lib/supabase/auth';
const pinHash = await hashPin("1234");
const user = {
  pinHash // Bcrypt hash
};

// CORRECT - Never display PIN or hash
// PIN should only be used in login forms
```

### Type Safety

Always use the Application `User` type in your code:

```typescript
// Good
import { User } from '@/types';
const user: User = ...;

// Avoid (unless working directly with database)
import { Database } from '@/types/database';
type DbUser = Database["public"]["Tables"]["users"]["Row"];
const dbUser: DbUser = ...; // Only in mapper layer
```

## Migration from Old Types

### Before (Old Types)
```typescript
interface User {
  id: string;
  phone: string;
  name: string;    // Single name field
  pin: string;     // Confusing naming
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### After (New Types)
```typescript
interface User {
  id: string;
  phone: string;
  firstName: string;  // Split name
  lastName: string;   // Split name
  pinHash: string;    // Clear it's a hash
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Code Changes Required

If you have existing code using `user.name`:

```typescript
// Old
const greeting = `Hello ${user.name}`;

// New
const greeting = `Hello ${user.firstName} ${user.lastName}`;
// Or use helper
import { getUserFullName } from '@/lib/mappers/userMapper';
const greeting = `Hello ${getUserFullName(user)}`;
```

If you're checking or setting PIN:

```typescript
// Old (confusing)
const hashedPin = await hashPin(pin);
user.pin = hashedPin; // Unclear if hashed or plain

// New (clear)
const pinHash = await hashPin(pin);
user.pinHash = pinHash; // Obviously a hash
```

## All Exported Types

From `types/index.ts`:

### Auth Types
- `User` - Application user with firstName/lastName/pinHash
- `LoginResult` - Result of login operation

### Enums
- `Relationship` - Family relationships
- `Gender` - Gender options
- `PackageStatus` - Package statuses
- `PackageCategory` - Package categories
- `VisitStatus` - Visit statuses
- `BookingStatus` - Booking statuses
- `TransactionType` - Transaction types
- `TransactionStatus` - Transaction statuses
- `PaymentProvider` - Payment providers
- `NotificationType` - Notification types
- `ApprovalStatus` - Approval statuses

### Entity Types
- `Dependent` - Family dependent
- `Package` - Health package
- `UserPackage` - User's purchased package
- `Visit` - Health facility visit
- `Booking` - Visit booking
- `Facility` - Health facility
- `FamilyMember` - Family member
- `Wallet` - User wallet
- `Transaction` - Wallet transaction
- `PaymentMethod` - Payment method
- `Notification` - User notification
- `ApprovalRequest` - Approval request

## Best Practices

### DO ✅

- Use Application `User` type in components and stores
- Use `mapDatabaseUserToUser()` when fetching from database
- Use `mapUserToDatabase()` when inserting to database
- Use `getUserFullName()` helper for display
- Keep mapper functions in `lib/mappers/`
- Never display `pinHash` to users
- Always hash PINs before storing

### DON'T ❌

- Don't use database types in components
- Don't store plain text PINs
- Don't display `pinHash` field
- Don't bypass the mapper layer
- Don't confuse `pin` (database) with `pinHash` (application)
- Don't manually split/join names (use mapper)

## File Structure

```
types/
  ├── index.ts           # Application types (User with firstName/lastName/pinHash)
  └── database.ts        # Database types (generated from Supabase)

lib/
  ├── mappers/
  │   └── userMapper.ts  # Mapping functions
  └── supabase/
      └── auth.ts        # Uses mapper automatically
```

## Summary

| Aspect | Database | Application |
|--------|----------|-------------|
| Name field | `name` (single) | `firstName` + `lastName` |
| PIN field | `pin` (hash) | `pinHash` (hash) |
| Timestamp format | `created_at` | `createdAt` |
| Where used | Database queries | Components, stores, UI |
| Mapping | Manual (in mapper) | Automatic (in auth.ts) |

---

**Version**: 1.0.0
**Last Updated**: 2025-12-22
**Status**: ✅ Complete
