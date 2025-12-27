/**
 * Validation utilities for forms
 */

/**
 * Validate Ugandan National ID Number (NIN)
 * Format: 14 alphanumeric characters (e.g., CM92018100J4GKL)
 *
 * Uganda NIN Format:
 * - Exactly 14 characters
 * - First 2 characters: Letters (e.g., CM, CF)
 * - Remaining 12 characters: Alphanumeric (mix of letters and numbers)
 * - Case insensitive (we uppercase it)
 *
 * Examples: CM92018100J4GKL, CF89023400P2ABC
 */
export function validateNIN(nin: string): boolean {
  if (!nin) return false;

  // Remove any whitespace
  const cleaned = nin.trim().toUpperCase();

  // Must be exactly 14 characters
  if (cleaned.length !== 14) return false;

  // Uganda NIN format: 2 letters followed by 12 alphanumeric characters
  const ninRegex = /^[A-Z]{2}[A-Z0-9]{12}$/;
  return ninRegex.test(cleaned);
}

/**
 * Alias for validateNIN (for consistency with naming convention)
 */
export function isValidNIN(nin: string): boolean {
  return validateNIN(nin);
}

/**
 * Format NIN to uppercase
 */
export function formatNIN(nin: string): string {
  return nin.toUpperCase().trim();
}

/**
 * Validate full name
 * Rules:
 * - Must not be empty
 * - Must be at least 2 characters
 * - Should contain at least first and last name (space separated)
 * - Each name part should be at least 1 character
 */
export function validateFullName(name: string): boolean {
  if (!name) return false;

  const trimmed = name.trim();

  // Must be at least 2 characters
  if (trimmed.length < 2) return false;

  // Should contain at least one space (first + last name)
  const parts = trimmed.split(/\s+/);
  return parts.length >= 2 && parts.every(part => part.length > 0);
}

/**
 * Alias for validateFullName (for consistency with naming convention)
 */
export function isValidFullName(name: string): boolean {
  return validateFullName(name);
}

/**
 * Split full name into first and last name
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  // First part is first name, rest is last name
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');

  return { firstName, lastName };
}
