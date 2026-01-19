import type { BookingFacility } from '@/types';

/**
 * Search facilities by name or address
 * @param facilities - Array of facilities to search
 * @param query - Search query string
 * @returns Filtered array of facilities matching the query
 */
export function searchFacilities(
  facilities: BookingFacility[],
  query: string
): BookingFacility[] {
  if (!query.trim()) return facilities;

  const lowerQuery = query.toLowerCase();
  return facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(lowerQuery) ||
      facility.address.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter facilities by service category
 * @param facilities - Array of facilities to filter
 * @param serviceCategory - Service category to filter by (e.g., "Consultations")
 * @returns Filtered array of facilities that offer the service
 */
export function filterByService(
  facilities: BookingFacility[],
  serviceCategory: string
): BookingFacility[] {
  if (!serviceCategory.trim()) return facilities;

  return facilities.filter((facility) =>
    facility.services.some(
      (service) =>
        service.toLowerCase().includes(serviceCategory.toLowerCase()) ||
        serviceCategory.toLowerCase().includes(service.toLowerCase())
    )
  );
}

/**
 * Sort facilities by distance (nearest first)
 * @param facilities - Array of facilities to sort
 * @returns Sorted array of facilities by distance
 */
export function sortByDistance(facilities: BookingFacility[]): BookingFacility[] {
  return [...facilities].sort((a, b) => a.distance - b.distance);
}

/**
 * Check if facility is currently open
 * @param facility - Facility to check
 * @returns True if facility is open, false otherwise
 */
export function isFacilityOpen(facility: BookingFacility): boolean {
  // Simplified check - in production would use actual time and operating hours
  return facility.isOpen;
}

/**
 * Get facility status label and variant for display
 * @param facility - Facility to get status for
 * @returns Object with label and variant for styling
 */
export function getFacilityStatusLabel(facility: BookingFacility): {
  label: string;
  variant: 'success' | 'warning' | 'closed';
} {
  if (!facility.isOpen) {
    return { label: 'Closed', variant: 'closed' };
  }
  if (facility.closingTime) {
    return { label: `Closes ${facility.closingTime}`, variant: 'warning' };
  }
  return { label: 'Open now', variant: 'success' };
}

/**
 * Format recommendation percentage with emoji
 * @param percent - Recommendation percentage (0-100)
 * @returns Formatted string with emoji
 */
export function formatRecommendation(percent: number): string {
  return `👍 ${percent}% recommended`;
}

/**
 * Get facilities that accept bookings only
 * @param facilities - Array of facilities to filter
 * @returns Filtered array of facilities that accept bookings
 */
export function getBookableFacilities(
  facilities: BookingFacility[]
): BookingFacility[] {
  return facilities.filter((facility) => facility.acceptsBookings);
}

/**
 * Get facilities that are walk-in only
 * @param facilities - Array of facilities to filter
 * @returns Filtered array of walk-in only facilities
 */
export function getWalkInFacilities(
  facilities: BookingFacility[]
): BookingFacility[] {
  return facilities.filter((facility) => facility.isWalkInOnly);
}

/**
 * Get facilities within a certain distance
 * @param facilities - Array of facilities to filter
 * @param maxDistance - Maximum distance in km
 * @returns Filtered array of facilities within the distance
 */
export function getFacilitiesWithinDistance(
  facilities: BookingFacility[],
  maxDistance: number
): BookingFacility[] {
  return facilities.filter((facility) => facility.distance <= maxDistance);
}

/**
 * Get the closest facility from a list
 * @param facilities - Array of facilities
 * @returns The closest facility or null if array is empty
 */
export function getClosestFacility(
  facilities: BookingFacility[]
): BookingFacility | null {
  if (facilities.length === 0) return null;

  return facilities.reduce((closest, current) =>
    current.distance < closest.distance ? current : closest
  );
}

/**
 * Check if facility is open on a specific day
 * @param facility - Facility to check
 * @param dayOfWeek - Day of week (0 = Sunday, 6 = Saturday)
 * @returns True if facility is open on that day
 */
export function isFacilityOpenOnDay(
  facility: BookingFacility,
  dayOfWeek: number
): boolean {
  // 0 = Sunday, 6 = Saturday, 1-5 = Weekdays
  if (dayOfWeek === 0) {
    return facility.hours.sunday !== 'Closed';
  } else if (dayOfWeek === 6) {
    return facility.hours.saturday !== 'Closed';
  } else {
    return facility.hours.weekdays !== 'Closed';
  }
}

/**
 * Format distance for display
 * @param distance - Distance in km
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m away`;
  }
  return `${distance.toFixed(1)} km away`;
}

/**
 * Combine search, filter, and sort operations
 * @param facilities - Array of facilities
 * @param query - Search query
 * @param serviceCategory - Service category to filter by
 * @returns Processed array of facilities
 */
export function processFacilities(
  facilities: BookingFacility[],
  query: string,
  serviceCategory?: string
): BookingFacility[] {
  let result = facilities;

  // Filter by service category first
  if (serviceCategory) {
    result = filterByService(result, serviceCategory);
  }

  // Then search by query
  if (query) {
    result = searchFacilities(result, query);
  }

  // Finally sort by distance
  result = sortByDistance(result);

  return result;
}
