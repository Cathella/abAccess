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
      className="w-full text-left bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2">
        {!notification.isRead && (
          <div className="w-2 h-2 bg-[#3A8DFF] rounded-full flex-shrink-0" />
        )}
        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-2" />

      {/* Message and timestamp */}
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <p className="text-sm text-gray-600 flex-1">
          {notification.message}
        </p>
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {timestamp}
        </span>
      </div>
    </button>
  );
}
