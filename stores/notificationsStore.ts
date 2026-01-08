import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '@/types';
import { MOCK_NOTIFICATIONS } from '@/lib/constants';

interface NotificationsState {
  // Data
  notifications: Notification[];
  isLoading: boolean;

  // Computed
  unreadCount: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;

  // Helpers
  getUnreadCount: () => number;
  hasUnread: () => boolean;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,
      isLoading: false,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,

      setNotifications: (notifications) => {
        set({
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length,
        });
      },

      addNotification: (notification) => {
        const { notifications } = get();
        const updated = [notification, ...notifications];
        set({
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length,
        });
      },

      markAsRead: (notificationId) => {
        const { notifications } = get();
        const updated = notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        set({
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length,
        });
      },

      markAllAsRead: () => {
        const { notifications } = get();
        const updated = notifications.map(n => ({ ...n, isRead: true }));
        set({
          notifications: updated,
          unreadCount: 0,
        });
      },
      removeNotification: (notificationId) => {
        const { notifications } = get();
        const updated = notifications.filter(n => n.id !== notificationId);
        set({
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length,
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter(n => !n.isRead).length;
      },

      hasUnread: () => {
        return get().unreadCount > 0;
      },
    }),
    {
      name: 'aba-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
