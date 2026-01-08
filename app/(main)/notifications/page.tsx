"use client";

import { useRouter } from 'next/navigation';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { NotificationsEmptyState } from '@/components/common/NotificationsEmptyState';
import { Header } from '@/components/common/Header';
import type { Notification } from '@/types';

export default function NotificationsPage() {
  const router = useRouter();
  const notifications = useNotificationsStore((state) => state.notifications);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const hasUnread = useNotificationsStore((state) => state.hasUnread);

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate if action route exists
    if (notification.actionRoute) {
      router.push(notification.actionRoute);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header title="Notifications" showBack={true} />

      {notifications.length === 0 ? (
        <NotificationsEmptyState />
      ) : (
        <div className="flex-1 px-4 py-4">
          {/* Mark as read action */}
          {hasUnread() && (
            <div className="flex justify-end mb-4">
              <button
                onClick={markAllAsRead}
                className="text-[#3A8DFF] font-medium text-base"
              >
                Mark as read
              </button>
            </div>
          )}

          {/* Notification list */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => handleNotificationPress(notification)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
