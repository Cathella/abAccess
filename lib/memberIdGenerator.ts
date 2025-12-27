/**
 * Generate a unique Member ID for new users
 * Format: A-XXXXXX (e.g., A-012345)
 *
 * The ID consists of:
 * - Letter prefix: "A" (for abAccess)
 * - Hyphen separator
 * - 6-digit number
 */
export function generateMemberId(): string {
  // Generate a random 6-digit number
  const randomNumber = Math.floor(Math.random() * 1000000);

  // Pad with leading zeros to ensure 6 digits
  const paddedNumber = randomNumber.toString().padStart(6, '0');

  // Return formatted ID
  return `A-${paddedNumber}`;
}

/**
 * Validate Member ID format
 * Returns true if valid, false otherwise
 */
export function isValidMemberId(memberId: string): boolean {
  // Format: A-XXXXXX where X is a digit
  const memberIdRegex = /^A-\d{6}$/;
  return memberIdRegex.test(memberId);
}
