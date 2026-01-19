import { Notification, NotificationType, UserPackageType } from '@/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NOTIFICATION_CONFIG } from './constants';

/**
 * Handle notification tap action
 */
export function handleNotificationAction(
  notification: Notification,
  router: AppRouterInstance,
  callbacks?: {
    onApprovalNeeded?: (notification: Notification) => void;
  }
): void {
  switch (notification.type) {
    case 'approval_needed':
      // Could open a modal or navigate to approval page
      if (callbacks?.onApprovalNeeded) {
        callbacks.onApprovalNeeded(notification);
      } else if (notification.actionRoute) {
        router.push(notification.actionRoute);
      }
      break;

    case 'booking_confirmed':
    case 'visit_reminder':
      router.push('/visits');
      break;

    case 'top_up_success':
      router.push('/wallet/history');
      break;

    case 'package_expiring':
    case 'package_purchased':
      router.push('/my-packages');
      break;

    case 'visit_completed':
      router.push('/visits?tab=completed');
      break;

    default:
      if (notification.actionRoute) {
        router.push(notification.actionRoute);
      }
  }
}

/**
 * Create a new notification (helper for other features)
 */
export function createNotification(
  type: NotificationType,
  message: string,
  options?: Partial<Notification>
): Notification {
  return {
    id: `notif-${Date.now()}`,
    type,
    title: NOTIFICATION_CONFIG[type].defaultTitle,
    message,
    timestamp: new Date().toISOString(),
    isRead: false,
    ...options,
  };
}

/**
 * Calculate days until package expiry
 */
export function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check for expiring packages and create notifications
 * @param packages - Array of user packages
 * @param existingNotifications - Existing notifications to avoid duplicates
 * @returns Array of new notifications to add
 */
export function checkExpiringPackages(
  packages: UserPackageType[],
  existingNotifications: Notification[]
): Notification[] {
  const newNotifications: Notification[] = [];

  // Filter for active packages that are expiring soon (within 3 days)
  const expiringPackages = packages.filter((pkg) => {
    if (pkg.status !== 'active') return false;

    const daysUntilExpiry = getDaysUntilExpiry(pkg.expiryDate);
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  });

  // Create notifications for packages that don't already have one
  expiringPackages.forEach((pkg) => {
    // Check if notification already exists for this package
    const exists = existingNotifications.some(
      (n) => n.type === 'package_expiring' && n.relatedId === pkg.id
    );

    if (!exists) {
      const daysUntilExpiry = getDaysUntilExpiry(pkg.expiryDate);
      const categoryName = pkg.package?.name || 'Package';

      newNotifications.push(
        createNotification(
          'package_expiring',
          `Your ${categoryName} expires in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'}. Use it before it expires!`,
          {
            relatedId: pkg.id,
            actionRoute: '/my-packages'
          }
        )
      );
    }
  });

  return newNotifications;
}
