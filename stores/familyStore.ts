import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Dependent } from '@/types'

const MAX_DEPENDENTS = 3

interface FamilyState {
  // State
  dependents: Dependent[]
  selectedDependent: Dependent | null
  isLoading: boolean
  error: string | null

  // Actions
  setDependents: (dependents: Dependent[]) => void
  addDependent: (dependent: Dependent) => void
  updateDependent: (id: string, data: Partial<Dependent>) => void
  removeDependent: (id: string) => void
  selectDependent: (dependent: Dependent | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearSelection: () => void
  reset: () => void

  // Getters
  getDependentById: (id: string) => Dependent | undefined
}

// Selectors for computed values
export const selectMaxDependents = () => MAX_DEPENDENTS
export const selectDependentCount = (state: FamilyState) => state.dependents.length
export const selectCanAddMore = (state: FamilyState) => state.dependents.length < MAX_DEPENDENTS

export const useFamilyStore = create<FamilyState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      dependents: [],
      selectedDependent: null,
      isLoading: false,
      error: null,

      // Actions
      setDependents: (dependents) =>
        set((state) => {
          state.dependents = dependents
        }),

      addDependent: (dependent) =>
        set((state) => {
          if (state.dependents.length < MAX_DEPENDENTS) {
            state.dependents.push(dependent)
            state.error = null
          } else {
            state.error = `Maximum of ${MAX_DEPENDENTS} dependents allowed`
          }
        }),

      updateDependent: (id, data) =>
        set((state) => {
          const index = state.dependents.findIndex(d => d.id === id)
          if (index !== -1) {
            state.dependents[index] = {
              ...state.dependents[index],
              ...data,
            }
            // Update selected dependent if it's the one being updated
            if (state.selectedDependent?.id === id) {
              state.selectedDependent = state.dependents[index]
            }
            state.error = null
          } else {
            state.error = 'Dependent not found'
          }
        }),

      removeDependent: (id) =>
        set((state) => {
          state.dependents = state.dependents.filter(d => d.id !== id)
          // Clear selection if removed dependent was selected
          if (state.selectedDependent?.id === id) {
            state.selectedDependent = null
          }
          state.error = null
        }),

      selectDependent: (dependent) =>
        set((state) => {
          state.selectedDependent = dependent
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),

      setError: (error) =>
        set((state) => {
          state.error = error
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedDependent = null
        }),

      reset: () =>
        set((state) => {
          state.dependents = []
          state.selectedDependent = null
          state.isLoading = false
          state.error = null
        }),

      // Computed getters
      getDependentById: (id) => {
        const { dependents } = get()
        return dependents.find(d => d.id === id)
      },
    })),
    {
      name: 'family-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dependents: state.dependents,
        // Don't persist selectedDependent, isLoading, or error
      }),
    }
  )
)
