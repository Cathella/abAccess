import type { Database } from "@/types/database";
import type { User } from "@/types";

type DatabaseUser = Database["public"]["Tables"]["users"]["Row"];

/**
 * Map database user to application User type
 * Database stores single "name" field and "pin" field
 * Application uses "firstName", "lastName", and "pinHash"
 */
export function mapDatabaseUserToUser(dbUser: DatabaseUser): User {
  // Split name into firstName and lastName
  const nameParts = dbUser.name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    id: dbUser.id,
    phone: dbUser.phone,
    firstName,
    lastName,
    pinHash: dbUser.pin, // Database "pin" is actually hashed
    memberId: dbUser.member_id || undefined,
    nin: dbUser.nin || undefined,
    avatar: dbUser.avatar || undefined,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
}

/**
 * Map application User to database insert format
 */
export function mapUserToDatabase(user: {
  phone: string;
  firstName: string;
  lastName: string;
  pinHash: string;
  memberId?: string;
  nin?: string;
  avatar?: string;
}): Database["public"]["Tables"]["users"]["Insert"] {
  // Combine firstName and lastName into single name field
  const name = `${user.firstName} ${user.lastName}`.trim();

  return {
    phone: user.phone,
    name,
    pin: user.pinHash, // Store as "pin" in database (already hashed)
    member_id: user.memberId || null,
    nin: user.nin || null,
    avatar: user.avatar || null,
  };
}

/**
 * Get full name from User
 */
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}
