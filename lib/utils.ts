import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TimeSlot } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format visit date for display
 * - Tomorrow: "Tomorrow"
 * - Within 7 days: "Fri, 10 Jan"
 * - Past or further: "On: 4 Jan 2025"
 */
export function formatVisitDate(dateString: string, includePrefix = true): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const oneWeekAway = new Date(today);
  oneWeekAway.setDate(oneWeekAway.getDate() + 7);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  // Check if tomorrow
  if (dateOnly.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }

  // Check if within next 7 days (and in the future)
  if (dateOnly > today && dateOnly <= oneWeekAway) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }); // "Fri, 10 Jan"
  }

  // Default format for past or further dates
  const formatted = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }); // "4 Jan 2025"

  return includePrefix ? `On: ${formatted}` : formatted;
}

/**
 * Format visit time for display
 */
export function formatVisitTime(time: string): string {
  return `At: ${time}`;
}

/**
 * Get initials from full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Group items by a key function
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Format notification timestamp for display
 * - < 1 hour: "X minutes ago"
 * - < 24 hours: "HH:MM AM/PM"
 * - Yesterday: "Yesterday"
 * - < 7 days: "X days ago"
 * - Older: "MMM D"
 */
export function formatNotificationTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Less than 1 hour
  if (diffMinutes < 60) {
    if (diffMinutes < 1) return 'Just now';
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }

  // Less than 24 hours - show time
  if (diffHours < 24) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }); // "10:34 AM"
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // Less than 7 days
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  // Older - show date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }); // "Jan 5"
}

// ============================================
// Booking Flow Date Utilities
// ============================================

/**
 * Format date for booking display: "Fri, 7 Jan 2026"
 */
export function formatBookingDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time slot for display: "Afternoon (12 PM - 4 PM)"
 */
export function formatTimeSlot(slot: TimeSlot): string {
  const options: Record<TimeSlot, string> = {
    morning: 'Morning (8 AM - 12 PM)',
    afternoon: 'Afternoon (12 PM - 4 PM)',
    evening: 'Evening (4 PM - 6 PM)',
  };
  return options[slot] || slot;
}

/**
 * Get days in month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get first day of month (0 = Sunday, 1 = Monday, etc.)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if date is today
 */
export function isTodayDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Get date string in ISO format (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
