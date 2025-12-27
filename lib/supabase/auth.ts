import { createClient } from "./client";
import type { Session } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { User, LoginResult } from "@/types";
import { mapDatabaseUserToUser } from "@/lib/mappers/userMapper";
import { generateMemberId } from "@/lib/memberIdGenerator";
import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

type UserRow = Database["public"]["Tables"]["users"]["Row"];

/**
 * Format a Ugandan phone number to international format
 * Accepts: 0781234567, +256781234567, 256781234567, 781234567
 * Returns: +256781234567 (always international format)
 * Validates it's a valid Ugandan number (MTN: 077, 078, 076; Airtel: 070, 075, 074)
 */
export function formatUgandanPhone(phone: string): string {
  // Remove all spaces, dashes, and parentheses
  let cleaned = phone.replace(/[\s\-()]/g, "");

  // Remove + if present
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // Remove country code if present (256)
  if (cleaned.startsWith("256")) {
    cleaned = cleaned.substring(3);
  }

  // Remove leading 0 if present
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // At this point, cleaned should be 9 digits starting with 7X
  if (cleaned.length !== 9) {
    throw new Error("Invalid phone number length");
  }

  // Validate it starts with valid Ugandan prefix
  const validPrefixes = ["70", "74", "75", "76", "77", "78"];
  const prefix = cleaned.substring(0, 2);

  if (!validPrefixes.includes(prefix)) {
    throw new Error(
      "Invalid Ugandan phone number. Must start with 070, 074, 075, 076, 077, or 078"
    );
  }

  // Return in international format
  return `+256${cleaned}`;
}

/**
 * Validate if phone number is a valid Ugandan phone number
 * Returns true if valid, false otherwise (doesn't throw)
 */
export function isValidUgandanPhone(phone: string): boolean {
  try {
    formatUgandanPhone(phone);
    return true;
  } catch {
    return false;
  }
}

/**
 * Hash a PIN for secure storage
 * Uses bcrypt with 10 salt rounds
 */
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, SALT_ROUNDS);
}

/**
 * Verify a PIN against its hash
 * Returns true if PIN matches, false otherwise
 */
export async function verifyPin(inputPin: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(inputPin, storedHash);
}

/**
 * Check if a user with this phone number exists
 */
export async function checkUserExists(
  phoneNumber: string
): Promise<{ exists: boolean; error?: string }> {
  try {
    // Format phone - this can throw if invalid
    let formattedPhone: string;
    try {
      formattedPhone = formatUgandanPhone(phoneNumber);
    } catch (formatError) {
      // Invalid phone format - user doesn't exist
      return { exists: false };
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("phone", formattedPhone)
      .single();

    if (error) {
      // If error is "no rows", user doesn't exist
      if (error.code === "PGRST116") {
        return { exists: false };
      }
      return { exists: false, error: error.message };
    }

    return { exists: !!data };
  } catch (error) {
    if (error instanceof Error) {
      return { exists: false, error: error.message };
    }
    return { exists: false, error: "Failed to check user" };
  }
}

/**
 * Login with phone number and PIN
 * This is the main authentication function for the app
 */
export async function login(
  phoneNumber: string,
  pin: string
): Promise<LoginResult & { session?: Session }> {
  try {
    const formattedPhone = formatUgandanPhone(phoneNumber);
    const supabase = createClient();

    // Query the users table to find a user with this phone
    const { data: userData, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", formattedPhone)
      .single<UserRow>();

    if (queryError) {
      // User not found
      if (queryError.code === "PGRST116") {
        return {
          success: false,
          error: "Account not found"
        };
      }
      return {
        success: false,
        error: queryError.message
      };
    }

    if (!userData) {
      return {
        success: false,
        error: "Account not found"
      };
    }

    // Verify PIN against stored hash
    const isPinValid = await verifyPin(pin, userData.pin);

    if (!isPinValid) {
      return {
        success: false,
        error: "Wrong PIN"
      };
    }

    // Map database user to application User type
    const user = mapDatabaseUserToUser(userData);

    // Create a session for this user
    // Note: This is a simplified approach. In production, you'd want to
    // use proper Supabase auth methods or JWT tokens
    const session: Session = {
      access_token: userData.id,
      refresh_token: "",
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: "bearer",
      user: {
        id: userData.id,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: userData.created_at,
      },
    };

    return {
      success: true,
      session,
      user
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to verify credentials" };
  }
}

/**
 * Verify phone number and PIN combination
 * Alias for login() for backward compatibility
 */
export async function verifyPhoneAndPin(
  phoneNumber: string,
  pin: string
): Promise<LoginResult & { session?: Session }> {
  return login(phoneNumber, pin);
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(
  phoneNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedPhone = formatUgandanPhone(phoneNumber);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to send OTP" };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(
  phoneNumber: string,
  token: string
): Promise<{ success: boolean; session?: Session; error?: string }> {
  try {
    const formattedPhone = formatUgandanPhone(phoneNumber);
    const supabase = createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: "sms",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.session) {
      return { success: false, error: "No session returned" };
    }

    return { success: true, session: data.session };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to verify OTP" };
  }
}

/**
 * Register a new user account
 * Creates a user in the database with hashed PIN
 */
export async function register(data: {
  phone: string;
  firstName: string;
  lastName: string;
  nin: string;
  pin: string;
}): Promise<LoginResult & { session?: Session }> {
  try {
    const { phone, firstName, lastName, nin, pin } = data;

    // Validate inputs
    if (!phone || !firstName || !lastName || !nin || !pin) {
      return {
        success: false,
        error: "All fields are required"
      };
    }

    // Format phone number
    let formattedPhone: string;
    try {
      formattedPhone = formatUgandanPhone(phone);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Invalid phone number"
      };
    }

    // Validate PIN format
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return {
        success: false,
        error: "PIN must be exactly 4 digits"
      };
    }

    const supabase = createClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("phone", formattedPhone)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "An account with this phone number already exists"
      };
    }

    // Hash the PIN
    const hashedPin = await hashPin(pin);

    // Combine firstName and lastName into full name for database
    const fullName = `${firstName} ${lastName}`.trim();

    // Generate unique Member ID
    const memberId = generateMemberId();

    // Create user in database
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        phone: formattedPhone,
        name: fullName,
        pin: hashedPin,
        member_id: memberId,
        nin: nin,
      })
      .select()
      .single<UserRow>();

    if (insertError || !newUser) {
      console.error("Registration error:", insertError);
      return {
        success: false,
        error: insertError?.message || "Failed to create account"
      };
    }

    // Map database user to application User type
    const user = mapDatabaseUserToUser(newUser);

    // Create a session for the new user
    const session: Session = {
      access_token: newUser.id,
      refresh_token: "",
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: "bearer",
      user: {
        id: newUser.id,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: newUser.created_at,
      },
    };

    return {
      success: true,
      session,
      user
    };
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create account" };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();

  // Clear relevant local storage items
  if (typeof window !== "undefined") {
    localStorage.removeItem("authStore");
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (session: Session | null) => void
): () => void {
  const supabase = createClient();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}
