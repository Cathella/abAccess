import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { register } from '@/lib/supabase/auth'
import type { User } from '@/types'
import type { Session } from '@supabase/supabase-js'

interface RegistrationState {
  // Registration data
  phone: string
  firstName: string
  lastName: string
  nin: string
  pin: string

  // Current step tracking
  currentStep: number

  // Actions
  setPhone: (phone: string) => void
  setName: (firstName: string, lastName: string) => void
  setNin: (nin: string) => void
  setPin: (pin: string) => void
  setCurrentStep: (step: number) => void
  createAccount: () => Promise<{ success: boolean; user?: User; session?: Session; error?: string }>
  clearRegistration: () => void
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      // Initial state
      phone: '',
      firstName: '',
      lastName: '',
      nin: '',
      pin: '',
      currentStep: 1,

      // Actions
      setPhone: (phone) => set({ phone }),

      setName: (firstName, lastName) =>
        set({ firstName, lastName }),

      setNin: (nin) => set({ nin }),

      setPin: (pin) => set({ pin }),

      setCurrentStep: (step) => set({ currentStep: step }),

      createAccount: async () => {
        const state = useRegistrationStore.getState()
        const { phone, firstName, lastName, nin, pin } = state

        // Validate all required fields
        if (!phone || !firstName || !lastName || !nin || !pin) {
          return {
            success: false,
            error: 'All registration fields are required'
          }
        }

        try {
          // Call registration API
          const result = await register({
            phone,
            firstName,
            lastName,
            nin,
            pin,
          })

          return result
        } catch (error) {
          console.error('Registration error:', error)
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create account'
          }
        }
      },

      clearRegistration: () =>
        set({
          phone: '',
          firstName: '',
          lastName: '',
          nin: '',
          pin: '',
          currentStep: 1,
        }),
    }),
    {
      name: 'registration-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist registration data, not sensitive info like PIN
      partialize: (state) => ({
        phone: state.phone,
        firstName: state.firstName,
        lastName: state.lastName,
        currentStep: state.currentStep,
        // Don't persist NIN or PIN for security
      }),
    }
  )
)
