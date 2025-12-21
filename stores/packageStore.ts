import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Package, UserPackage } from '@/types'

interface PackageState {
  // State
  packages: Package[]
  userPackages: UserPackage[]
  selectedPackage: Package | null
  isLoading: boolean

  // Actions
  setPackages: (packages: Package[]) => void
  setUserPackages: (userPackages: UserPackage[]) => void
  selectPackage: (packageId: string) => void
  clearSelection: () => void
  purchasePackage: (userPackage: UserPackage) => void
  setLoading: (isLoading: boolean) => void
  updateUserPackage: (packageId: string, updates: Partial<UserPackage>) => void

  // Computed getters
  getActivePackages: () => UserPackage[]
  getExpiredPackages: () => UserPackage[]
  getTotalVisitsRemaining: () => number
  getPackageById: (id: string) => Package | undefined
  getUserPackageById: (id: string) => UserPackage | undefined
}

export const usePackageStore = create<PackageState>()(
  immer((set, get) => ({
    // Initial state
    packages: [],
    userPackages: [],
    selectedPackage: null,
    isLoading: false,

    // Actions
    setPackages: (packages) =>
      set((state) => {
        state.packages = packages
      }),

    setUserPackages: (userPackages) =>
      set((state) => {
        state.userPackages = userPackages
      }),

    selectPackage: (packageId) =>
      set((state) => {
        const pkg = state.packages.find(p => p.id === packageId)
        state.selectedPackage = pkg || null
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedPackage = null
      }),

    purchasePackage: (userPackage) =>
      set((state) => {
        state.userPackages.push(userPackage)
      }),

    setLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading
      }),

    updateUserPackage: (packageId, updates) =>
      set((state) => {
        const index = state.userPackages.findIndex(p => p.id === packageId)
        if (index !== -1) {
          state.userPackages[index] = {
            ...state.userPackages[index],
            ...updates
          }
        }
      }),

    // Computed getters
    getActivePackages: () => {
      const { userPackages } = get()
      return userPackages.filter(
        (pkg) => pkg.status === 'active' && pkg.visitsRemaining > 0
      )
    },

    getExpiredPackages: () => {
      const { userPackages } = get()
      const now = new Date().toISOString()
      return userPackages.filter(
        (pkg) =>
          pkg.status === 'expired' ||
          pkg.status === 'exhausted' ||
          new Date(pkg.expiryDate) < new Date(now)
      )
    },

    getTotalVisitsRemaining: () => {
      const activePackages = get().getActivePackages()
      return activePackages.reduce(
        (total, pkg) => total + pkg.visitsRemaining,
        0
      )
    },

    getPackageById: (id) => {
      const { packages } = get()
      return packages.find(pkg => pkg.id === id)
    },

    getUserPackageById: (id) => {
      const { userPackages } = get()
      return userPackages.find(pkg => pkg.id === id)
    },
  }))
)
