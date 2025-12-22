import { createClient } from "./client";
import type { Session } from "@supabase/supabase-js";

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
 * Verify phone number and PIN combination
 */
export async function verifyPhoneAndPin(
  phoneNumber: string,
  pin: string
): Promise<{ success: boolean; session?: Session; user?: any; error?: string }> {
  try {
    const formattedPhone = formatUgandanPhone(phoneNumber);
    const supabase = createClient();

    // Query the users table to find a user with this phone and PIN
    const { data: userData, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", formattedPhone)
      .eq("pin", pin)
      .single();

    if (queryError || !userData) {
      return {
        success: false,
        error: "Invalid phone number or PIN"
      };
    }

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
      user: userData
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to verify credentials" };
  }
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
