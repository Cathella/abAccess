import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
