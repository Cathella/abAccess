/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Format date as "12 Mar 2016"
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString

  const day = date.getDate()
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

/**
 * Format relative time as "2 months ago", "3 days ago", etc.
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  } else {
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
  }
}

/**
 * Check if date makes person under 18 years old
 * @param dateOfBirth - ISO date string or Date object
 * @returns True if person is under 18
 */
export function isUnder18(dateOfBirth: string | Date): boolean {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
  const now = new Date()
  const age = calculateAge(dob)
  return age < 18
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth - ISO date string or Date object
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDiff = now.getMonth() - dob.getMonth()

  // Adjust if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--
  }

  return age
}

/**
 * Format age with appropriate unit (years, months, or days)
 * @param dateOfBirth - ISO date string or Date object
 * @returns Formatted age string like "2 years", "6 months", or "15 days"
 */
export function formatAge(dateOfBirth: string | Date): string {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
  const now = new Date()

  const years = calculateAge(dob)

  if (years >= 1) {
    return `${years} ${years === 1 ? 'year' : 'years'}`
  }

  // Calculate months for infants
  const months = (now.getFullYear() - dob.getFullYear()) * 12 + now.getMonth() - dob.getMonth()

  if (months >= 1) {
    return `${months} ${months === 1 ? 'month' : 'months'}`
  }

  // Calculate days for newborns
  const diffInMs = now.getTime() - dob.getTime()
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  return `${days} ${days === 1 ? 'day' : 'days'}`
}

/**
 * Check if a date is valid
 * @param dateString - Date string to validate
 * @returns True if valid date
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Convert date to ISO string (YYYY-MM-DD)
 * @param date - Date object or date string
 * @returns ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * Get maximum date for child (today's date - can be newborn)
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getMaxDateForChild(): string {
  return toISODateString(new Date())
}

/**
 * Get minimum date for child (18 years ago from today)
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getMinDateForChild(): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return toISODateString(date)
}
