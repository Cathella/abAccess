import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
