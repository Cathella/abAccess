import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Notification } from '@/types'

interface UIState {
  // State
  isBottomNavVisible: boolean
  activeTab: string
  notifications: Notification[]
  unreadCount: number
  isOnline: boolean

  // Actions
  setBottomNavVisible: (visible: boolean) => void
  setActiveTab: (tab: string) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  setOnline: (online: boolean) => void
  clearNotifications: () => void
  removeNotification: (notificationId: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    immer((set) => ({
      // Initial state
      isBottomNavVisible: true,
      activeTab: 'dashboard',
      notifications: [],
      unreadCount: 0,
      isOnline: true,

      // Actions
      setBottomNavVisible: (visible) =>
        set((state) => {
          state.isBottomNavVisible = visible
        }),

      setActiveTab: (tab) =>
        set((state) => {
          state.activeTab = tab
        }),

      addNotification: (notification) =>
        set((state) => {
          state.notifications.unshift(notification)
          if (!notification.isRead) {
            state.unreadCount += 1
          }
        }),

      markAsRead: (notificationId) =>
        set((state) => {
          const notification = state.notifications.find(n => n.id === notificationId)
          if (notification && !notification.isRead) {
            notification.isRead = true
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
        }),

      markAllAsRead: () =>
        set((state) => {
          state.notifications.forEach(notification => {
            notification.isRead = true
          })
          state.unreadCount = 0
        }),

      setOnline: (online) =>
        set((state) => {
          state.isOnline = online
        }),

      clearNotifications: () =>
        set((state) => {
          state.notifications = []
          state.unreadCount = 0
        }),

      removeNotification: (notificationId) =>
        set((state) => {
          const index = state.notifications.findIndex(n => n.id === notificationId)
          if (index !== -1) {
            const notification = state.notifications[index]
            if (!notification.isRead) {
              state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
            state.notifications.splice(index, 1)
          }
        }),
    })),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist UI preferences, not notifications or online status
        isBottomNavVisible: state.isBottomNavVisible,
        activeTab: state.activeTab,
      }),
    }
  )
)
