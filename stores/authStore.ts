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
  // State
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  pin: string | null // For current session only, not persisted
  phoneNumber: string | null // For OTP flow
  isOtpSent: boolean
  isVerifying: boolean

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  signIn: (user: User, session: Session) => void
  signOut: () => void
  verifyPin: (inputPin: string) => boolean
  setPin: (pin: string) => void
  clearAuth: () => void
  setPhoneNumber: (phoneNumber: string | null) => void
  setOtpSent: (isOtpSent: boolean) => void
  setVerifying: (isVerifying: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      pin: null,
      phoneNumber: null,
      isOtpSent: false,
      isVerifying: false,

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

      signIn: (user, session) =>
        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false
        }),

      signOut: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          pin: null,
          isLoading: false,
          phoneNumber: null,
          isOtpSent: false,
          isVerifying: false
        }),

      verifyPin: (inputPin) => {
        const state = get()
        if (!state.user?.pin) return false
        return state.user.pin === inputPin
      },

      setPin: (pin) =>
        set({ pin }),

      clearAuth: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          pin: null,
          isLoading: false,
          phoneNumber: null,
          isOtpSent: false,
          isVerifying: false
        }),

      setPhoneNumber: (phoneNumber) =>
        set({ phoneNumber }),

      setOtpSent: (isOtpSent) =>
        set({ isOtpSent }),

      setVerifying: (isVerifying) =>
        set({ isVerifying }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user and session, not pin or loading states
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
