import { Notification } from '@/types';
import { formatNotificationTime } from '@/lib/utils';

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const timestamp = formatNotificationTime(notification.timestamp);

  return (
    <button
      onClick={onPress}
      className="w-full text-left bg-neutral-200 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2">
        {!notification.isRead && (
          <div className="w-2 h-2 bg-secondary-900 rounded-full shrink-0" />
        )}
        <h3 className="font-semibold text-base text-neutral-900">{notification.title}</h3>
      </div>

      {/* Divider */}
      <div className="border-b border-neutral-400 mb-2" />

      {/* Message and timestamp */}
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <p className="text-sm text-neutral-900 flex-1">
          {notification.message}
        </p>
        <span className="text-sm text-neutral-700 whitespace-nowrap">
          {timestamp}
        </span>
      </div>
    </button>
  );
}
