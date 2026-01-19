import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'

interface Session {
  access_token: string
  refresh_token: string
  expires_at?: number
  user_id?: string
}

interface AuthState {
  // User
  user: User | null

  // Login flow
  phoneNumber: string
  isPhoneValid: boolean

  // PIN attempts tracking
  pinAttempts: number
  isPinLocked: boolean
  maxAttempts: number

  // Loading
  isLoading: boolean

  // Session
  session: Session | null
  isAuthenticated: boolean

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  setAuthenticated: (auth: boolean) => void
  setPhoneNumber: (phone: string) => void
  setPhoneValid: (valid: boolean) => void
  incrementPinAttempts: () => void
  resetPinAttempts: () => void
  lockPin: () => void
  signIn: (user: User, session: Session) => void
  signOut: () => void
  clearAuth: () => void
  logout: () => void
  deleteAccount: () => Promise<void>
}

const MAX_PIN_ATTEMPTS = 3

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      phoneNumber: '',
      isPhoneValid: false,
      pinAttempts: 0,
      isPinLocked: false,
      maxAttempts: MAX_PIN_ATTEMPTS,
      isLoading: false,
      session: null,
      isAuthenticated: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user
        }),

      setSession: (session) =>
        set({ session }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setAuthenticated: (auth) =>
        set({ isAuthenticated: auth }),

      setPhoneNumber: (phone) =>
        set({
          phoneNumber: phone,
          // Reset PIN attempts when phone changes
          pinAttempts: 0,
          isPinLocked: false
        }),

      setPhoneValid: (valid) =>
        set({ isPhoneValid: valid }),

      incrementPinAttempts: () => {
        const { pinAttempts, maxAttempts } = get()
        const newAttempts = pinAttempts + 1

        set({
          pinAttempts: newAttempts,
          isPinLocked: newAttempts >= maxAttempts
        })
      },

      resetPinAttempts: () =>
        set({
          pinAttempts: 0,
          isPinLocked: false
        }),

      lockPin: () =>
        set({
          isPinLocked: true,
          pinAttempts: MAX_PIN_ATTEMPTS
        }),

      signIn: (user, session) =>
        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
          // Reset PIN attempts on successful login
          pinAttempts: 0,
          isPinLocked: false
        }),

      signOut: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          // Keep phoneNumber for "Welcome back" experience
          // Reset PIN attempts
          pinAttempts: 0,
          isPinLocked: false,
          isPhoneValid: false
        }),

      clearAuth: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          phoneNumber: '',
          isPhoneValid: false,
          pinAttempts: 0,
          isPinLocked: false
        }),

      logout: () => {
        // Clear auth state
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          pinAttempts: 0,
          isPinLocked: false,
          isPhoneValid: false
        })

        // Clear other stores (dynamic import to avoid circular deps)
        Promise.all([
          import('./walletStore').then(m => m.useWalletStore.getState().reset?.()),
          import('./familyStore').then(m => m.useFamilyStore.getState().reset?.()),
          import('./packageStore').then(m => m.usePackageStore.getState().clearAllData()),
          import('./notificationsStore').then(m => m.useNotificationsStore.getState().clearAll()),
          import('./settingsStore').then(m => m.useSettingsStore.getState().resetSettings()),
        ]).catch(() => {
          // Stores may not all have reset methods, that's ok
        })
      },

      deleteAccount: async () => {
        // In production: Call API to delete account
        // await api.deleteAccount();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Then logout (clears all stores)
        get().logout()
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist user for "Welcome back" display
        user: state.user,
        // Persist phoneNumber to remember last login
        phoneNumber: state.phoneNumber,
        // Do NOT persist:
        // - pinAttempts (reset on app restart for security)
        // - isAuthenticated (check fresh each time)
        // - session (checked fresh via Supabase)
        // - isPinLocked (reset on app restart)
      }),
    }
  )
)
