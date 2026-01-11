import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PackageType, UserPackageType, PackageUsage, PackageStatusType } from '@/types'
import { checkExpiringPackages } from '@/lib/notifications'

interface PackageState {
  // User's packages
  userPackages: UserPackageType[]

  // Available packages (for browsing/purchase)
  availablePackages: PackageType[]

  // Selected package for detail view
  selectedPackage: UserPackageType | null

  // Filter
  packageFilter: 'active' | 'completed' | 'expired'

  // Loading
  isLoading: boolean

  // Has initialized (loaded data at least once)
  hasInitialized: boolean

  // Actions
  setUserPackages: (packages: UserPackageType[]) => void
  addUserPackage: (pkg: UserPackageType) => void
  updateUserPackage: (id: string, data: Partial<UserPackageType>) => void
  setAvailablePackages: (packages: PackageType[]) => void
  selectPackage: (pkg: UserPackageType | null) => void
  setPackageFilter: (filter: 'active' | 'completed' | 'expired') => void
  setLoading: (loading: boolean) => void
  recordUsage: (packageId: string, usage: PackageUsage) => void
  addBonusVisit: (packageId: string) => void
  loadUserPackages: (userId: string, options?: { force?: boolean }) => Promise<void>
  loadMockData: () => void
  clearAllData: () => void
  checkAndNotifyExpiringPackages: () => void
}

export const usePackageStore = create<PackageState>()(
  persist(
    (set, get) => ({
      // Initial state
      userPackages: [],
      availablePackages: [],
      selectedPackage: null,
      packageFilter: 'active',
      isLoading: false,
      hasInitialized: false,

      // Actions
      setUserPackages: (packages) => set({ userPackages: packages }),

      addUserPackage: (pkg) =>
        set((state) => {
          const exists = state.userPackages.some((existing) => existing.id === pkg.id)
          if (exists) {
            return {
              userPackages: state.userPackages.map((existing) =>
                existing.id === pkg.id ? pkg : existing
              ),
            }
          }
          return { userPackages: [...state.userPackages, pkg] }
        }),

      updateUserPackage: (id, data) =>
        set((state) => ({
          userPackages: state.userPackages.map((pkg) =>
            pkg.id === id ? { ...pkg, ...data } : pkg
          ),
        })),

      setAvailablePackages: (packages) =>
        set({ availablePackages: packages }),

      selectPackage: (pkg) => set({ selectedPackage: pkg }),

      setPackageFilter: (filter) => set({ packageFilter: filter }),

      setLoading: (loading) => set({ isLoading: loading }),

      recordUsage: (packageId, usage) =>
        set((state) => ({
          userPackages: state.userPackages.map((pkg) => {
            if (pkg.id === packageId) {
              const newUsedVisits = pkg.usedVisits + 1
              const newRemainingVisits = pkg.remainingVisits - 1
              const newStatus: PackageStatusType =
                newRemainingVisits === 0 ? 'completed' : pkg.status

              return {
                ...pkg,
                usedVisits: newUsedVisits,
                remainingVisits: newRemainingVisits,
                status: newStatus,
                completedDate:
                  newRemainingVisits === 0 ? new Date().toISOString() : pkg.completedDate,
                usageHistory: [...pkg.usageHistory, usage],
              }
            }
            return pkg
          }),
        })),

      addBonusVisit: (packageId) => {
        const { userPackages } = get()
        const updated = userPackages.map((pkg) =>
          pkg.id === packageId
            ? {
                ...pkg,
                remainingVisits: pkg.remainingVisits + 1,
                totalVisits: pkg.totalVisits + 1,
              }
            : pkg
        )
        set({ userPackages: updated })
      },

      loadUserPackages: async (userId: string, options?: { force?: boolean }) => {
        const { isLoading, hasInitialized } = get()
        const force = options?.force === true

        // Skip if already loading or has data
        if (!force && (isLoading || (hasInitialized && get().userPackages.length > 0))) {
          return
        }

        set({ isLoading: true })

        try {
          // Import dynamically to avoid circular dependencies
          const { getUserPackages } = await import('@/lib/packages')
          const packages = await getUserPackages(userId)

          set({
            userPackages: packages,
            hasInitialized: true,
            isLoading: false
          })

          // Check for expiring packages after loading
          get().checkAndNotifyExpiringPackages()
        } catch (error) {
          console.error('Error loading user packages:', error)
          set({ isLoading: false })
        }
      },

      loadMockData: () => {
        // Import mock data
        const { mockUserPackages } = require('@/lib/packages/mockData')
        set({
          userPackages: mockUserPackages,
          hasInitialized: true
        })

        // Check for expiring packages after loading mock data
        get().checkAndNotifyExpiringPackages()
      },

      clearAllData: () => {
        set({
          userPackages: [],
          availablePackages: [],
          selectedPackage: null,
          hasInitialized: false,
          packageFilter: 'active',
        })
      },

      checkAndNotifyExpiringPackages: () => {
        const { userPackages } = get()

        // Import notifications store dynamically to avoid circular dependency
        import('./notificationsStore').then(({ useNotificationsStore }) => {
          const { notifications, addNotification } = useNotificationsStore.getState()

          // Check for expiring packages
          const newNotifications = checkExpiringPackages(userPackages, notifications)

          // Add new notifications
          newNotifications.forEach((notification) => {
            addNotification(notification)
          })
        })
      },
    }),
    {
      name: 'package-storage',
      partialize: (state) => ({
        userPackages: state.userPackages,
        availablePackages: state.availablePackages,
        hasInitialized: state.hasInitialized,
      }),
    }
  )
)

// Computed selectors
export const useActivePackages = () =>
  usePackageStore((state) =>
    state.userPackages.filter((pkg) => pkg.status === 'active')
  )

export const useCompletedPackages = () =>
  usePackageStore((state) =>
    state.userPackages.filter((pkg) => pkg.status === 'completed')
  )

export const useExpiredPackages = () =>
  usePackageStore((state) =>
    state.userPackages.filter((pkg) => pkg.status === 'expired')
  )
