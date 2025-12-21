# Zustand Stores Documentation

This directory contains all the global state management stores for ABA Access using Zustand.

## Stores Overview

### 1. `authStore.ts` - Authentication State
Manages user authentication, session, and PIN verification.

### 2. `packageStore.ts` - Package Management
Manages available packages and user-purchased packages.

### 3. `walletStore.ts` - Wallet & Transactions
Manages wallet balance and transaction history.

### 4. `uiStore.ts` - UI State & Notifications
Manages UI state, notifications, and online status.

### 5. `familyStore.ts` - Family & Dependents
Manages family members and dependents.

---

## Auth Store

### State
```typescript
{
  user: User | null              // Current user data
  session: Session | null        // Auth session tokens
  isLoading: boolean            // Loading state
  isAuthenticated: boolean      // Auth status
  pin: string | null           // Session PIN (not persisted)
}
```

### Actions

**`setUser(user: User | null)`**
- Updates the current user
- Automatically updates `isAuthenticated` based on user presence

**`setSession(session: Session | null)`**
- Updates the auth session

**`signIn(user: User, session: Session)`**
- Signs in a user with session data
- Sets authentication to true

**`signOut()`**
- Clears all auth data including user, session, and PIN
- Resets authentication state

**`verifyPin(inputPin: string): boolean`**
- Verifies PIN against stored user PIN
- Returns true if match, false otherwise

**`setPin(pin: string)`**
- Sets the PIN for current session only
- PIN is NOT persisted to localStorage

**`clearAuth()`**
- Completely resets all auth state
- Useful for logout or error recovery

### Usage Example

```tsx
'use client'

import { useAuthStore } from '@/stores'

export default function LoginPage() {
  const { user, isAuthenticated, signIn, signOut } = useAuthStore()

  const handleLogin = async (userData: User, sessionData: Session) => {
    signIn(userData, sessionData)
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
    </div>
  )
}
```

### Persistence
- ✅ Persisted: `user`, `session`, `isAuthenticated`
- ❌ Not persisted: `pin`, `isLoading`
- Storage: localStorage (`auth-storage` key)

---

## Package Store

### State
```typescript
{
  packages: Package[]              // All available packages
  userPackages: UserPackage[]      // User's purchased packages
  selectedPackage: Package | null  // Currently selected package
  isLoading: boolean              // Loading state
}
```

### Actions

**`setPackages(packages: Package[])`**
- Sets all available packages

**`setUserPackages(userPackages: UserPackage[])`**
- Sets user's purchased packages

**`selectPackage(packageId: string)`**
- Selects a package by ID
- Updates `selectedPackage` state

**`clearSelection()`**
- Clears the selected package

**`purchasePackage(userPackage: UserPackage)`**
- Adds a newly purchased package to user packages

**`setLoading(isLoading: boolean)`**
- Sets loading state

### Computed Getters

**`getActivePackages(): UserPackage[]`**
- Returns only active packages with remaining visits

**`getExpiredPackages(): UserPackage[]`**
- Returns expired or exhausted packages

**`getTotalVisitsRemaining(): number`**
- Calculates total visits remaining across all active packages

**`getPackageById(id: string): Package | undefined`**
- Finds a package by ID

**`getUserPackageById(id: string): UserPackage | undefined`**
- Finds a user package by ID

### Usage Example

```tsx
'use client'

import { usePackageStore } from '@/stores'

export default function MyPackagesPage() {
  const {
    userPackages,
    getActivePackages,
    getTotalVisitsRemaining,
    isLoading
  } = usePackageStore()

  const activePackages = getActivePackages()
  const totalVisits = getTotalVisitsRemaining()

  return (
    <div>
      <h1>My Packages</h1>
      <p>Total visits remaining: {totalVisits}</p>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {activePackages.map(pkg => (
            <div key={pkg.id}>
              <h3>{pkg.package?.name}</h3>
              <p>Visits left: {pkg.visitsRemaining}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### No Persistence
Package data is fetched fresh on each session and not persisted locally.

---

## Wallet Store

### State
```typescript
{
  wallet: Wallet | null           // Wallet data
  transactions: Transaction[]     // All transactions
  isLoading: boolean             // Loading state
  topUpAmount: number            // Current top-up amount
}
```

### Actions

**`setWallet(wallet: Wallet | null)`**
- Sets wallet data

**`setTransactions(transactions: Transaction[])`**
- Sets all transactions

**`setTopUpAmount(amount: number)`**
- Sets the top-up amount for UI state

**`addTransaction(transaction: Transaction)`**
- Adds a new transaction to the beginning of the list

**`updateBalance(newBalance: number)`**
- Updates wallet balance and timestamp

**`updateTransaction(transactionId: string, updates: Partial<Transaction>)`**
- Updates a specific transaction (e.g., status change)

**`setLoading(isLoading: boolean)`**
- Sets loading state

### Computed Getters

**`getTransactionsByType(type: TransactionType): Transaction[]`**
- Filters transactions by type (topUp, purchase, refund)

**`getRecentTransactions(limit?: number): Transaction[]`**
- Returns recent transactions (default limit: 10)
- Sorted by date descending

**`getPendingTransactions(): Transaction[]`**
- Returns only pending transactions

**`getTotalTopUps(): number`**
- Calculates total completed top-ups

**`getTotalPurchases(): number`**
- Calculates total completed purchases

### Usage Example

```tsx
'use client'

import { useWalletStore } from '@/stores'

export default function WalletPage() {
  const {
    wallet,
    transactions,
    getRecentTransactions,
    getTotalTopUps,
    addTransaction,
    updateBalance,
    isLoading
  } = useWalletStore()

  const recentTxns = getRecentTransactions(5)
  const totalTopUps = getTotalTopUps()

  const handleTopUp = async (amount: number) => {
    // Create transaction
    const transaction = {
      id: 'txn-123',
      walletId: wallet?.id!,
      type: 'topUp' as const,
      amount,
      description: 'Wallet top-up',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }

    addTransaction(transaction)

    // After payment confirmation
    updateBalance((wallet?.balance || 0) + amount)
  }

  return (
    <div>
      <h1>Wallet</h1>
      <p>Balance: RWF {wallet?.balance.toLocaleString()}</p>
      <p>Total Top-ups: RWF {totalTopUps.toLocaleString()}</p>

      <h2>Recent Transactions</h2>
      {recentTxns.map(txn => (
        <div key={txn.id}>
          <p>{txn.description}</p>
          <p>RWF {txn.amount}</p>
          <p>{txn.status}</p>
        </div>
      ))}
    </div>
  )
}
```

### No Persistence
Wallet and transaction data is fetched fresh on each session.

---

## UI Store

### State
```typescript
{
  isBottomNavVisible: boolean    // Bottom navigation visibility
  activeTab: string              // Currently active tab
  notifications: Notification[]  // In-app notifications
  unreadCount: number           // Unread notification count
  isOnline: boolean            // Online/offline status
}
```

### Actions

**`setBottomNavVisible(visible: boolean)`**
- Shows or hides the bottom navigation

**`setActiveTab(tab: string)`**
- Sets the currently active tab

**`addNotification(notification: Notification)`**
- Adds a new notification
- Automatically updates unread count

**`markAsRead(notificationId: string)`**
- Marks a specific notification as read
- Decrements unread count

**`markAllAsRead()`**
- Marks all notifications as read
- Resets unread count to 0

**`setOnline(online: boolean)`**
- Updates online/offline status

**`clearNotifications()`**
- Removes all notifications

**`removeNotification(notificationId: string)`**
- Removes a specific notification

### Usage Example

```tsx
'use client'

import { useUIStore } from '@/stores'
import { useEffect } from 'react'

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  } = useUIStore()

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>Notifications ({unreadCount} unread)</h1>
        <button onClick={markAllAsRead}>Mark All as Read</button>
      </div>

      {notifications.map(notification => (
        <div
          key={notification.id}
          onClick={() => handleMarkAsRead(notification.id)}
          className={notification.isRead ? 'opacity-50' : ''}
        >
          <h3>{notification.title}</h3>
          <p>{notification.body}</p>
          {!notification.isRead && <span>NEW</span>}
        </div>
      ))}
    </div>
  )
}
```

### Persistence
- ✅ Persisted: `isBottomNavVisible`, `activeTab`
- ❌ Not persisted: `notifications`, `unreadCount`, `isOnline`
- Storage: localStorage (`ui-storage` key)

---

## Family Store

### State
```typescript
{
  dependents: Dependent[]          // All family dependents
  selectedDependent: Dependent | null  // Currently selected dependent
  isLoading: boolean              // Loading state
}
```

### Actions

**`setDependents(dependents: Dependent[])`**
- Sets all dependents

**`addDependent(dependent: Dependent)`**
- Adds a new dependent

**`updateDependent(dependentId: string, updates: Partial<Dependent>)`**
- Updates a specific dependent
- Updates selected dependent if it's the one being updated

**`removeDependent(dependentId: string)`**
- Removes a dependent
- Clears selection if removed dependent was selected

**`selectDependent(dependentId: string | null)`**
- Selects a dependent by ID
- Pass null to clear selection

**`setLoading(isLoading: boolean)`**
- Sets loading state

**`clearSelection()`**
- Clears the selected dependent

### Computed Getters

**`getDependentById(id: string): Dependent | undefined`**
- Finds a dependent by ID

**`getDependentsByRelationship(relationship: string): Dependent[]`**
- Filters dependents by relationship type

**`getChildrenCount(): number`**
- Returns the count of children dependents

### Usage Example

```tsx
'use client'

import { useFamilyStore } from '@/stores'
import { createClient } from '@/lib/supabase/client'

export default function FamilyPage() {
  const {
    dependents,
    selectedDependent,
    setDependents,
    selectDependent,
    addDependent,
    removeDependent,
    getChildrenCount
  } = useFamilyStore()

  const supabase = createClient()
  const childrenCount = getChildrenCount()

  useEffect(() => {
    async function fetchDependents() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('dependents')
          .select('*')
          .eq('user_id', user.id)

        if (data) setDependents(data)
      }
    }

    fetchDependents()
  }, [])

  const handleAddDependent = async (newDependent: Dependent) => {
    const { data, error } = await supabase
      .from('dependents')
      .insert(newDependent)
      .select()
      .single()

    if (!error && data) {
      addDependent(data)
    }
  }

  return (
    <div>
      <h1>Family Members</h1>
      <p>Children: {childrenCount}</p>

      {dependents.map(dependent => (
        <div
          key={dependent.id}
          onClick={() => selectDependent(dependent.id)}
          className={selectedDependent?.id === dependent.id ? 'selected' : ''}
        >
          <h3>{dependent.name}</h3>
          <p>{dependent.relationship}</p>
          <button onClick={() => removeDependent(dependent.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

### No Persistence
Family data is fetched fresh on each session and not persisted locally.

---

## Best Practices

### 1. Import from Central Location
```typescript
// ✅ Good
import { useAuthStore, usePackageStore, useWalletStore } from '@/stores'

// ❌ Avoid
import { useAuthStore } from '@/stores/authStore'
```

### 2. Use Selectors for Performance
```typescript
// ✅ Good - Only re-renders when user changes
const user = useAuthStore(state => state.user)

// ❌ Avoid - Re-renders on any auth state change
const { user } = useAuthStore()
```

### 3. Computed Values Over Direct State
```typescript
// ✅ Good - Use computed getters
const activePackages = usePackageStore(state => state.getActivePackages())

// ❌ Avoid - Manual filtering
const { userPackages } = usePackageStore()
const activePackages = userPackages.filter(pkg => pkg.status === 'active')
```

### 4. Type Safety
All stores are fully typed with TypeScript. Use the types from `@/types` for consistency.

### 5. Server Components
Zustand stores only work in Client Components. Mark your component with `'use client'`:

```tsx
'use client'

import { useAuthStore } from '@/stores'

export default function MyComponent() {
  // Now you can use the store
}
```

---

## Store Architecture

### State Management Pattern
- **Single Source of Truth**: Each store manages its domain
- **Immutable Updates**: All state updates create new objects
- **Computed Values**: Derived state via getter functions
- **No Side Effects**: Actions only update state, API calls happen in components/hooks

### Integration with Supabase
Stores hold **UI state** and **cached data**. For data fetching:

1. Fetch from Supabase in components/hooks
2. Update store with fetched data
3. Use store for UI rendering and optimistic updates

Example:
```typescript
const supabase = createClient()
const setUserPackages = usePackageStore(state => state.setUserPackages)

useEffect(() => {
  async function fetchPackages() {
    const { data } = await supabase
      .from('user_packages')
      .select('*')

    if (data) setUserPackages(data)
  }

  fetchPackages()
}, [])
```

---

## Testing Stores

```typescript
import { useAuthStore } from '@/stores'

// Reset store before each test
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: false,
    pin: null,
  })
})

test('signIn updates auth state', () => {
  const { signIn } = useAuthStore.getState()

  signIn(mockUser, mockSession)

  const state = useAuthStore.getState()
  expect(state.isAuthenticated).toBe(true)
  expect(state.user).toEqual(mockUser)
})
```
