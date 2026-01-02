import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types';
import type { Database } from '@/types/database';
import * as bcrypt from 'bcryptjs';
import { mapDatabaseUserToUser } from '@/lib/mappers/userMapper';

const SALT_ROUNDS = 10;

// Database type alias
type UserRow = Database['public']['Tables']['users']['Row'];

// Service response type
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate NIN format (Uganda National ID)
 * Format: 14 alphanumeric characters (e.g., CM12345678901234)
 */
export function validateNIN(nin: string): boolean {
  if (!nin) return false;

  // Remove spaces and convert to uppercase
  const cleaned = nin.replace(/\s/g, '').toUpperCase();

  // Must be 14 characters
  if (cleaned.length !== 14) return false;

  // Must be alphanumeric
  const alphanumericRegex = /^[A-Z0-9]{14}$/;
  return alphanumericRegex.test(cleaned);
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<ServiceResult<User>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: mapDatabaseUserToUser(data),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user profile',
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<{
    name: string;
    nin: string;
    avatar: string;
  }>
): Promise<ServiceResult<User>> {
  try {
    const supabase = createClient();

    // Validate NIN if provided
    if (data.nin && !validateNIN(data.nin)) {
      return {
        success: false,
        error: 'Invalid NIN format. Must be 14 alphanumeric characters.',
      };
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.nin !== undefined) updateData.nin = data.nin;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    // Update user
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: mapDatabaseUserToUser(updatedUser),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user profile',
    };
  }
}

/**
 * Update user avatar
 */
export async function updateUserAvatar(
  userId: string,
  avatarUrl: string
): Promise<ServiceResult<User>> {
  try {
    const supabase = createClient();

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        avatar: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: mapDatabaseUserToUser(updatedUser),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update avatar',
    };
  }
}

/**
 * Verify current PIN
 */
export async function verifyCurrentPin(
  userId: string,
  currentPin: string
): Promise<ServiceResult<boolean>> {
  try {
    const supabase = createClient();

    // Get user's PIN hash
    const { data: user, error } = await supabase
      .from('users')
      .select('pin')
      .eq('id', userId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Verify PIN
    const isValid = await bcrypt.compare(currentPin, user.pin);

    return {
      success: true,
      data: isValid,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify PIN',
    };
  }
}

/**
 * Update user PIN
 */
export async function updateUserPin(
  userId: string,
  currentPin: string,
  newPin: string
): Promise<ServiceResult<User>> {
  try {
    // Verify current PIN first
    const verifyResult = await verifyCurrentPin(userId, currentPin);

    if (!verifyResult.success) {
      return {
        success: false,
        error: verifyResult.error,
      };
    }

    if (!verifyResult.data) {
      return {
        success: false,
        error: 'Current PIN is incorrect',
      };
    }

    // Validate new PIN
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return {
        success: false,
        error: 'PIN must be 4 digits',
      };
    }

    // Hash new PIN
    const hashedPin = await bcrypt.hash(newPin, SALT_ROUNDS);

    const supabase = createClient();

    // Update PIN
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        pin: hashedPin,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: mapDatabaseUserToUser(updatedUser),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update PIN',
    };
  }
}
