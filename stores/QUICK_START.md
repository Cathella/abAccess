# Zustand Stores Quick Start Guide

## Installation
Zustand is already installed. No additional setup needed!

## Available Stores

### 1. Auth Store
```typescript
import { useAuthStore } from '@/stores'

// In a component
const { user, isAuthenticated, signIn, signOut } = useAuthStore()
```

**Key Features:**
- ✅ Persisted to localStorage (except PIN)
- ✅ Session management
- ✅ PIN verification for secure actions

### 2. Package Store
```typescript
import { usePackageStore } from '@/stores'

// In a component
const {
  packages,
  userPackages,
  getActivePackages,
  getTotalVisitsRemaining
} = usePackageStore()
```

**Key Features:**
- ✅ Separate available packages and user packages
- ✅ Computed values (active, expired, total visits)
- ✅ Package selection state

### 3. Wallet Store
```typescript
import { useWalletStore } from '@/stores'

// In a component
const {
  wallet,
  transactions,
  getRecentTransactions,
  updateBalance
} = useWalletStore()
```

**Key Features:**
- ✅ Balance tracking
- ✅ Transaction history
- ✅ Computed totals (top-ups, purchases)
- ✅ Top-up amount state

### 4. UI Store
```typescript
import { useUIStore } from '@/stores'

// In a component
const {
  notifications,
  unreadCount,
  isBottomNavVisible,
  addNotification,
  markAsRead
} = useUIStore()
```

**Key Features:**
- ✅ Partial persistence (UI preferences only)
- ✅ Notification management
- ✅ Unread count tracking
- ✅ Online/offline status
- ✅ Uses immer for easier state updates

### 5. Family Store
```typescript
import { useFamilyStore } from '@/stores'

// In a component
const {
  dependents,
  selectedDependent,
  addDependent,
  getChildrenCount
} = useFamilyStore()
```

**Key Features:**
- ✅ Dependent management
- ✅ Relationship filtering
- ✅ Selection state
- ✅ Uses immer for easier state updates

---

## Common Patterns

### Pattern 1: Sign In Flow
```typescript
'use client'

import { useAuthStore } from '@/stores'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const { signIn, setLoading } = useAuthStore()
  const supabase = createClient()

  const handleSignIn = async (phone: string) => {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    })

    if (!error && data.user) {
      // Fetch user data from database
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (userData) {
        signIn(userData, data.session!)
      }
    }

    setLoading(false)
  }

  return <button onClick={() => handleSignIn('+250123456789')}>Sign In</button>
}
```

### Pattern 2: Fetch and Display Packages
```typescript
'use client'

import { useEffect } from 'react'
import { usePackageStore } from '@/stores'
import { createClient } from '@/lib/supabase/client'

export default function PackagesPage() {
  const {
    packages,
    setPackages,
    isLoading,
    setLoading
  } = usePackageStore()

  const supabase = createClient()

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true)

      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)

      if (data) setPackages(data)
      setLoading(false)
    }

    fetchPackages()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p>{pkg.description}</p>
          <p>Price: RWF {pkg.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
```

### Pattern 3: Display Wallet with Transactions
```typescript
'use client'

import { useEffect } from 'react'
import { useWalletStore } from '@/stores'
import { createClient } from '@/lib/supabase/client'

export default function WalletPage() {
  const {
    wallet,
    setWallet,
    transactions,
    setTransactions,
    getRecentTransactions
  } = useWalletStore()

  const supabase = createClient()
  const recentTxns = getRecentTransactions(5)

  useEffect(() => {
    async function fetchWalletData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Fetch wallet
        const { data: walletData } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (walletData) setWallet(walletData)

        // Fetch transactions
        const { data: txnData } = await supabase
          .from('transactions')
          .select('*')
          .eq('wallet_id', walletData?.id)
          .order('created_at', { ascending: false })

        if (txnData) setTransactions(txnData)
      }
    }

    fetchWalletData()
  }, [])

  return (
    <div>
      <h1>Balance: RWF {wallet?.balance.toLocaleString()}</h1>

      <h2>Recent Transactions</h2>
      {recentTxns.map(txn => (
        <div key={txn.id}>
          <p>{txn.description}</p>
          <p>RWF {txn.amount}</p>
        </div>
      ))}
    </div>
  )
}
```

### Pattern 4: Using Computed Values
```typescript
'use client'

import { usePackageStore } from '@/stores'

export default function MyPackagesPage() {
  // Call computed functions
  const activePackages = usePackageStore(state => state.getActivePackages())
  const totalVisits = usePackageStore(state => state.getTotalVisitsRemaining())
  const expiredPackages = usePackageStore(state => state.getExpiredPackages())

  return (
    <div>
      <h2>Total Visits Remaining: {totalVisits}</h2>

      <h3>Active Packages ({activePackages.length})</h3>
      {activePackages.map(pkg => (
        <div key={pkg.id}>
          {pkg.package?.name} - {pkg.visitsRemaining} visits left
        </div>
      ))}

      <h3>Expired Packages ({expiredPackages.length})</h3>
      {expiredPackages.map(pkg => (
        <div key={pkg.id}>
          {pkg.package?.name} - Expired
        </div>
      ))}
    </div>
  )
}
```

### Pattern 5: Optimistic Updates
```typescript
'use client'

import { useWalletStore } from '@/stores'
import { createClient } from '@/lib/supabase/client'

export default function TopUpPage() {
  const { wallet, addTransaction, updateBalance } = useWalletStore()
  const supabase = createClient()

  const handleTopUp = async (amount: number) => {
    // Optimistic update
    const optimisticTxn = {
      id: `temp-${Date.now()}`,
      wallet_id: wallet!.id,
      type: 'topUp' as const,
      amount,
      description: 'Wallet top-up',
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    }

    addTransaction(optimisticTxn)

    // Make API call
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet!.id,
        type: 'topUp',
        amount,
        description: 'Wallet top-up',
        status: 'completed',
      })
      .select()
      .single()

    if (!error && data) {
      // Replace optimistic transaction with real one
      updateBalance((wallet?.balance || 0) + amount)
    }
  }

  return <button onClick={() => handleTopUp(10000)}>Top Up RWF 10,000</button>
}
```

---

## Performance Tips

### 1. Use Selectors
```typescript
// ✅ Good - Only re-renders when user changes
const user = useAuthStore(state => state.user)

// ❌ Avoid - Re-renders on any store change
const { user } = useAuthStore()
```

### 2. Multiple Selectors
```typescript
// ✅ Good - Separate selectors for better performance
const user = useAuthStore(state => state.user)
const isLoading = useAuthStore(state => state.isLoading)

// ❌ Avoid - Single destructure causes more re-renders
const { user, isLoading } = useAuthStore()
```

### 3. Computed Values in Render
```typescript
// ✅ Good - Computed once per render
const activePackages = usePackageStore(state => state.getActivePackages())

// ❌ Avoid - Filtering on every render
const userPackages = usePackageStore(state => state.userPackages)
const activePackages = userPackages.filter(pkg => pkg.status === 'active')
```

---

## TypeScript Support

All stores are fully typed. Import types from `@/types`:

```typescript
import type { User, Package, Wallet, Transaction } from '@/types'
```

Store state is automatically typed - no need to add type annotations when using the stores!

---

## Debugging

### Check Store State
```typescript
// Get current state without subscribing
const currentState = useAuthStore.getState()
console.log('Current auth state:', currentState)
```

### Reset Store (for testing)
```typescript
// Reset to initial state
useAuthStore.setState({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  pin: null,
})
```

### Listen to Changes
```typescript
// Subscribe to store changes (useful for debugging)
const unsubscribe = useAuthStore.subscribe(
  (state) => console.log('Auth state changed:', state)
)

// Don't forget to unsubscribe
unsubscribe()
```

---

## Next Steps

1. ✅ Stores are ready to use
2. 📖 Read the full [README.md](./README.md) for detailed documentation
3. 🔗 Integrate with Supabase using the patterns above
4. 🎨 Build your UI components with store data
