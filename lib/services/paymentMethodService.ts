import { createClient } from '@/lib/supabase/client';
import type { SavedPaymentMethod, PaymentMethodType } from '@/types';
import type { Database } from '@/types/database';

// Database type aliases
type PaymentMethodRow = Database['public']['Tables']['payment_methods']['Row'];
type PaymentProvider = Database['public']['Enums']['payment_provider'];

// Service response type
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Map database payment provider to app payment method type
 */
function mapDbPaymentProviderToApp(dbProvider: string): PaymentMethodType {
  switch (dbProvider) {
    case 'mtnMomo':
      return 'mtn_momo';
    case 'airtelMoney':
      return 'airtel_money';
    case 'card':
      return 'card';
    default:
      return 'mtn_momo';
  }
}

/**
 * Map app payment method type to database payment provider
 */
function mapAppPaymentProviderToDb(appType: PaymentMethodType): PaymentProvider {
  switch (appType) {
    case 'mtn_momo':
      return 'mtnMomo' as PaymentProvider;
    case 'airtel_money':
      return 'airtelMoney' as PaymentProvider;
    case 'card':
      return 'card' as PaymentProvider;
  }
}

/**
 * Map database payment method row to SavedPaymentMethod type
 */
function mapPaymentMethodRowToSavedPaymentMethod(
  row: PaymentMethodRow
): SavedPaymentMethod {
  const type = mapDbPaymentProviderToApp(row.type);

  return {
    id: row.id,
    type,
    phoneNumber: type !== 'card' ? row.account_number : undefined,
    cardLast4: type === 'card' ? row.account_number : undefined,
    cardBrand: type === 'card' ? row.provider : undefined,
    isDefault: row.is_default,
  };
}

/**
 * Get all payment methods for a user
 */
export async function getPaymentMethods(
  userId: string
): Promise<ServiceResult<SavedPaymentMethod[]>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const paymentMethods: SavedPaymentMethod[] = (data || []).map(
      mapPaymentMethodRowToSavedPaymentMethod
    );

    return {
      success: true,
      data: paymentMethods,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get payment methods',
    };
  }
}

/**
 * Add a new payment method
 */
export async function addPaymentMethod(data: {
  userId: string;
  type: PaymentMethodType;
  provider: string;
  accountNumber: string;
  isDefault: boolean;
}): Promise<ServiceResult<SavedPaymentMethod>> {
  try {
    const supabase = createClient();

    // Check for duplicates (same type + account number)
    const { data: existing } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('user_id', data.userId)
      .eq('type', mapAppPaymentProviderToDb(data.type))
      .eq('account_number', data.accountNumber)
      .single();

    if (existing) {
      return {
        success: false,
        error: 'This payment method is already saved',
      };
    }

    // If setting as default, unset other defaults first
    if (data.isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', data.userId);
    }

    // Insert new payment method
    const { data: newMethod, error: insertError } = await supabase
      .from('payment_methods')
      .insert({
        user_id: data.userId,
        type: mapAppPaymentProviderToDb(data.type),
        provider: data.provider,
        account_number: data.accountNumber,
        is_default: data.isDefault,
      })
      .select()
      .single();

    if (insertError) {
      return {
        success: false,
        error: insertError.message,
      };
    }

    return {
      success: true,
      data: mapPaymentMethodRowToSavedPaymentMethod(newMethod),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add payment method',
    };
  }
}

/**
 * Remove a payment method
 */
export async function removePaymentMethod(
  paymentMethodId: string
): Promise<ServiceResult<void>> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove payment method',
    };
  }
}

/**
 * Set a payment method as default
 */
export async function setDefaultPaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<ServiceResult<SavedPaymentMethod>> {
  try {
    const supabase = createClient();

    // Unset all defaults for this user
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Set the specified method as default
    const { data: updatedMethod, error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
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
      data: mapPaymentMethodRowToSavedPaymentMethod(updatedMethod),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to set default payment method',
    };
  }
}

/**
 * Update a payment method
 */
export async function updatePaymentMethod(
  paymentMethodId: string,
  data: Partial<{
    provider: string;
    accountNumber: string;
    isDefault: boolean;
  }>
): Promise<ServiceResult<SavedPaymentMethod>> {
  try {
    const supabase = createClient();

    // Build update object
    const updateData: any = {};
    if (data.provider !== undefined) updateData.provider = data.provider;
    if (data.accountNumber !== undefined) updateData.account_number = data.accountNumber;
    if (data.isDefault !== undefined) {
      updateData.is_default = data.isDefault;

      // If setting as default, unset others first
      if (data.isDefault) {
        const { data: method } = await supabase
          .from('payment_methods')
          .select('user_id')
          .eq('id', paymentMethodId)
          .single();

        if (method) {
          await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', method.user_id);
        }
      }
    }

    const { data: updatedMethod, error } = await supabase
      .from('payment_methods')
      .update(updateData)
      .eq('id', paymentMethodId)
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
      data: mapPaymentMethodRowToSavedPaymentMethod(updatedMethod),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment method',
    };
  }
}
