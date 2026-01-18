import { Bell } from 'lucide-react';
import Link from 'next/link';

interface NotificationBellProps {
  unreadCount: number;
}

export function NotificationBell({ unreadCount }: NotificationBellProps) {
  const displayCount = unreadCount > 9 ? '9+' : unreadCount.toString();
  return (
    <Link href="/notifications" className="relative">
      <div className="w-12 h-12 bg-[#E3F1FC] rounded-full flex items-center justify-center">
        <Bell className="w-6 h-6 text-neutral-900" />
      </div>

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 rounded-full flex items-center justify-center px-1">
          <span className="text-white text-xs font-bold">{displayCount}</span>
        </span>
      )}
    </Link>
  );
}
