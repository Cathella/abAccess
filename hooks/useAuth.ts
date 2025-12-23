"use client";

import { useAuthStore } from "@/stores/authStore";
import { login as loginAuth, signOut as signOutAuth, checkUserExists } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

/**
 * Custom hook for authentication
 * Provides a convenient API for auth operations
 */
export function useAuth() {
  const router = useRouter();

  // Get state from authStore
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const isPinLocked = useAuthStore((state) => state.isPinLocked);
  const pinAttempts = useAuthStore((state) => state.pinAttempts);

  // Get actions from authStore
  const signInStore = useAuthStore((state) => state.signIn);
  const signOutStore = useAuthStore((state) => state.signOut);
  const setLoading = useAuthStore((state) => state.setLoading);
  const incrementPinAttempts = useAuthStore((state) => state.incrementPinAttempts);

  /**
   * Login with phone number and PIN
   * @param phone - Phone number (any format)
   * @param pin - 4-digit PIN
   * @returns Promise with success status, user data, or error message
   */
  const login = async (phone: string, pin: string) => {
    try {
      setLoading(true);

      // Check if PIN is locked
      if (isPinLocked) {
        setLoading(false);
        return {
          success: false,
          error: "Account locked after 3 failed attempts. Please try again later."
        };
      }

      // Call auth service
      const result = await loginAuth(phone, pin);

      if (result.success && result.user && result.session) {
        // Update store on success (this also resets PIN attempts)
        signInStore(result.user, result.session);
        setLoading(false);
        return {
          success: true,
          user: result.user
        };
      } else {
        // Increment PIN attempts on failure
        incrementPinAttempts();
        setLoading(false);
        return {
          success: false,
          error: result.error || "Login failed"
        };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred"
      };
    }
  };

  /**
   * Logout current user
   * Clears store and redirects to welcome page
   */
  const logout = async () => {
    try {
      setLoading(true);

      // Call Supabase signOut
      await signOutAuth();

      // Clear store (keeps phoneNumber for UX)
      signOutStore();

      setLoading(false);

      // Redirect to welcome
      router.push("/welcome");
    } catch (error) {
      setLoading(false);
      console.error("Logout error:", error);
      // Still redirect even on error
      router.push("/welcome");
    }
  };

  /**
   * Check if a phone number has an existing account
   * @param phone - Phone number to check
   * @returns Promise with exists boolean and optional error
   */
  const checkPhone = async (phone: string) => {
    try {
      const result = await checkUserExists(phone);
      return {
        exists: result.exists,
        error: result.error
      };
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : "Failed to check phone"
      };
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    phoneNumber,
    isPinLocked,
    pinAttempts,

    // Actions
    login,
    logout,
    checkPhone,
  };
}
