import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Dependent } from '@/types'

interface FamilyState {
  // State
  dependents: Dependent[]
  selectedDependent: Dependent | null
  isLoading: boolean

  // Actions
  setDependents: (dependents: Dependent[]) => void
  addDependent: (dependent: Dependent) => void
  updateDependent: (dependentId: string, updates: Partial<Dependent>) => void
  removeDependent: (dependentId: string) => void
  selectDependent: (dependentId: string | null) => void
  setLoading: (isLoading: boolean) => void
  clearSelection: () => void

  // Computed getters
  getDependentById: (id: string) => Dependent | undefined
  getDependentsByRelationship: (relationship: string) => Dependent[]
  getChildrenCount: () => number
}

export const useFamilyStore = create<FamilyState>()(
  immer((set, get) => ({
    // Initial state
    dependents: [],
    selectedDependent: null,
    isLoading: false,

    // Actions
    setDependents: (dependents) =>
      set((state) => {
        state.dependents = dependents
      }),

    addDependent: (dependent) =>
      set((state) => {
        state.dependents.push(dependent)
      }),

    updateDependent: (dependentId, updates) =>
      set((state) => {
        const index = state.dependents.findIndex(d => d.id === dependentId)
        if (index !== -1) {
          state.dependents[index] = {
            ...state.dependents[index],
            ...updates
          }
          // Update selected dependent if it's the one being updated
          if (state.selectedDependent?.id === dependentId) {
            state.selectedDependent = state.dependents[index]
          }
        }
      }),

    removeDependent: (dependentId) =>
      set((state) => {
        state.dependents = state.dependents.filter(d => d.id !== dependentId)
        // Clear selection if removed dependent was selected
        if (state.selectedDependent?.id === dependentId) {
          state.selectedDependent = null
        }
      }),

    selectDependent: (dependentId) =>
      set((state) => {
        if (dependentId === null) {
          state.selectedDependent = null
        } else {
          const dependent = state.dependents.find(d => d.id === dependentId)
          state.selectedDependent = dependent || null
        }
      }),

    setLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedDependent = null
      }),

    // Computed getters
    getDependentById: (id) => {
      const { dependents } = get()
      return dependents.find(d => d.id === id)
    },

    getDependentsByRelationship: (relationship) => {
      const { dependents } = get()
      return dependents.filter(d => d.relationship === relationship)
    },

    getChildrenCount: () => {
      const { dependents } = get()
      return dependents.filter(d => d.relationship === 'child').length
    },
  }))
)
