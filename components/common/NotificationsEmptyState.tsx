import { BellOff } from 'lucide-react';

export function NotificationsEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <div className="relative">
        <BellOff className="w-16 h-16 text-amber-400" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-6">
        No notifications yet
      </h2>

      <p className="text-base text-gray-500 text-center mt-2 max-w-xs">
        You'll see updates about your packages, bookings, and approvals here.
      </p>
    </div>
  );
}
