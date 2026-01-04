import { createClient } from '@/lib/supabase/client';
import type { Wallet, WalletTransaction, Transaction } from '@/types';
import type { Database } from '@/types/database';
import { generateTransactionId } from '@/lib/wallet';

// Database type aliases
type WalletRow = Database['public']['Tables']['wallets']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionType = Database['public']['Enums']['transaction_type'];
type TransactionStatus = Database['public']['Enums']['transaction_status'];

// Service response type
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Map database transaction type to app type
 */
function mapDbTransactionTypeToApp(dbType: string): 'top_up' | 'purchase' {
  switch (dbType) {
    case 'topUp':
      return 'top_up';
    case 'purchase':
      return 'purchase';
    default:
      return 'top_up';
  }
}

/**
 * Map app transaction type to database type
 */
function mapAppTransactionTypeToDb(appType: 'top_up' | 'purchase'): TransactionType {
  switch (appType) {
    case 'top_up':
      return 'topUp' as TransactionType;
    case 'purchase':
      return 'purchase' as TransactionType;
  }
}

/**
 * Map database wallet row to Wallet type
 */
function mapWalletRowToWallet(row: WalletRow): Wallet {
  return {
    id: row.id,
    userId: row.user_id,
    balance: Number(row.balance),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map database transaction row to WalletTransaction type
 */
function mapTransactionRowToWalletTransaction(row: TransactionRow): WalletTransaction {
  const metadata = (row.metadata as any) || {};

  return {
    id: row.id,
    type: mapDbTransactionTypeToApp(row.type),
    amount: Number(row.amount),
    fee: metadata.fee || 0,
    status: row.status as 'pending' | 'completed' | 'failed',
    paymentMethod: metadata.paymentMethod || 'mtn_momo',
    phoneNumber: metadata.phoneNumber,
    cardLast4: metadata.cardLast4,
    cardBrand: metadata.cardBrand,
    packageName: metadata.packageName,
    packageVisits: metadata.packageVisits,
    transactionId: row.reference || generateTransactionId(),
    createdAt: row.created_at,
  };
}

/**
 * Get or create a wallet for a user
 */
export async function getOrCreateWallet(
  userId: string
): Promise<ServiceResult<Wallet>> {
  try {
    const supabase = createClient();

    // Try to get existing wallet
    const { data: wallet, error: fetchError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Wallet exists
    if (wallet && !fetchError) {
      return {
        success: true,
        data: mapWalletRowToWallet(wallet),
      };
    }

    // Wallet doesn't exist, create it
    const { data: newWallet, error: createError } = await supabase
      .from('wallets')
      .insert({
        user_id: userId,
        balance: 0,
      })
      .select()
      .single();

    if (createError) {
      return {
        success: false,
        error: createError.message,
      };
    }

    return {
      success: true,
      data: mapWalletRowToWallet(newWallet),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get or create wallet',
    };
  }
}

/**
 * Get wallet balance for a user
 */
export async function getWalletBalance(
  userId: string
): Promise<ServiceResult<number>> {
  try {
    const result = await getOrCreateWallet(userId);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data.balance,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get wallet balance',
    };
  }
}

/**
 * Update wallet balance (direct update - use carefully)
 */
export async function updateWalletBalance(
  walletId: string,
  newBalance: number
): Promise<ServiceResult<Wallet>> {
  try {
    const supabase = createClient();

    // Validate amount
    if (newBalance < 0) {
      return {
        success: false,
        error: 'Balance cannot be negative',
      };
    }

    const { data: updatedWallet, error } = await supabase
      .from('wallets')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('id', walletId)
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
      data: mapWalletRowToWallet(updatedWallet),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update wallet balance',
    };
  }
}

/**
 * Add a transaction to the wallet
 */
export async function addTransaction(data: {
  walletId: string;
  type: 'top_up' | 'purchase' | 'refund';
  amount: number;
  description: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: {
    paymentMethod?: string;
    phoneNumber?: string;
    cardLast4?: string;
    cardBrand?: string;
    packageName?: string;
    packageVisits?: number;
    fee?: number;
  };
}): Promise<ServiceResult<WalletTransaction>> {
  try {
    const supabase = createClient();

    // Validate amount
    if (data.amount <= 0) {
      return {
        success: false,
        error: 'Amount must be greater than 0',
      };
    }

    // Insert transaction
    const { data: newTransaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: data.walletId,
        type: mapAppTransactionTypeToDb(data.type as 'top_up' | 'purchase'),
        amount: data.amount,
        description: data.description,
        reference: data.reference || generateTransactionId(),
        status: data.status as TransactionStatus,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (insertError) {
      return {
        success: false,
        error: insertError.message,
      };
    }

    // If transaction is completed and affects balance, update wallet balance
    if (
      data.status === 'completed' &&
      (data.type === 'top_up' || data.type === 'refund' || data.type === 'purchase')
    ) {
      console.log('[WalletService] Updating balance for completed transaction', {
        walletId: data.walletId,
        amount: data.amount,
        type: data.type,
      });

      const { data: wallet, error: walletFetchError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', data.walletId)
        .single();

      if (walletFetchError) {
        console.error('Failed to fetch wallet for balance update:', walletFetchError);
      } else if (wallet) {
        const currentBalance = Number(wallet.balance);
        const newBalance =
          data.type === 'purchase'
            ? currentBalance - data.amount
            : currentBalance + data.amount;
        console.log('[WalletService] Balance update:', {
          currentBalance,
          addAmount: data.amount,
          newBalance,
        });

        if (newBalance < 0) {
          return {
            success: false,
            error: 'Insufficient balance for purchase',
          };
        }

        const { error: updateError } = await supabase
          .from('wallets')
          .update({
            balance: newBalance,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.walletId);

        if (updateError) {
          console.error('Failed to update wallet balance:', updateError);
          return {
            success: false,
            error: `Transaction created but balance update failed: ${updateError.message}`,
          };
        } else {
          console.log('[WalletService] Balance updated successfully');
        }
      }
    } else {
      console.log('[WalletService] Skipping balance update:', {
        status: data.status,
        type: data.type,
        shouldUpdate:
          data.status === 'completed' &&
          (data.type === 'top_up' || data.type === 'refund' || data.type === 'purchase'),
      });
    }

    return {
      success: true,
      data: mapTransactionRowToWalletTransaction(newTransaction),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add transaction',
    };
  }
}

/**
 * Get transactions for a wallet
 */
export async function getTransactions(
  walletId: string,
  limit?: number
): Promise<ServiceResult<WalletTransaction[]>> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const transactions: WalletTransaction[] = (data || []).map(
      mapTransactionRowToWalletTransaction
    );

    return {
      success: true,
      data: transactions,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transactions',
    };
  }
}

/**
 * Get a single transaction by ID
 */
export async function getTransactionById(
  transactionId: string
): Promise<ServiceResult<WalletTransaction>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: mapTransactionRowToWalletTransaction(data),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction',
    };
  }
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: 'pending' | 'completed' | 'failed'
): Promise<ServiceResult<WalletTransaction>> {
  try {
    const supabase = createClient();

    // Get transaction first to check if we need to update balance
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError) {
      return {
        success: false,
        error: fetchError.message,
      };
    }

    // Update transaction status
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update({ status: status as TransactionStatus })
      .eq('id', transactionId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      };
    }

    // If changing to completed and type is topUp or refund, update wallet balance
    if (
      status === 'completed' &&
      transaction.status !== 'completed' &&
      (transaction.type === 'topUp' || transaction.type === 'refund')
    ) {
      const { data: wallet, error: walletFetchError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', transaction.wallet_id)
        .single();

      if (walletFetchError) {
        console.error('Failed to fetch wallet for balance update:', walletFetchError);
      } else if (wallet) {
        const newBalance = Number(wallet.balance) + Number(transaction.amount);
        const { error: updateError } = await supabase
          .from('wallets')
          .update({
            balance: newBalance,
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.wallet_id);

        if (updateError) {
          console.error('Failed to update wallet balance:', updateError);
          return {
            success: false,
            error: `Status updated but balance update failed: ${updateError.message}`,
          };
        }
      }
    }

    return {
      success: true,
      data: mapTransactionRowToWalletTransaction(updatedTransaction),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update transaction status',
    };
  }
}

/**
 * Process a top-up transaction (main handler for wallet top-ups)
 */
export async function processTopUp(data: {
  userId: string;
  amount: number;
  paymentMethod: 'mtn_momo' | 'airtel_money' | 'card';
  phoneNumber?: string;
  cardLast4?: string;
  cardBrand?: string;
  fee?: number;
}): Promise<
  ServiceResult<{
    wallet: Wallet;
    transaction: WalletTransaction;
  }>
> {
  try {
    // Validate amount
    if (data.amount <= 0 || data.amount > 5000000) {
      return {
        success: false,
        error: 'Amount must be between 1 and 5,000,000 UGX',
      };
    }

    // Get or create wallet
    const walletResult = await getOrCreateWallet(data.userId);
    if (!walletResult.success || !walletResult.data) {
      return {
        success: false,
        error: walletResult.error || 'Failed to get wallet',
      };
    }

    const wallet = walletResult.data;

    // Create transaction with metadata
    const transactionResult = await addTransaction({
      walletId: wallet.id,
      type: 'top_up',
      amount: data.amount,
      description: `Top up via ${
        data.paymentMethod === 'mtn_momo'
          ? 'MTN Mobile Money'
          : data.paymentMethod === 'airtel_money'
          ? 'Airtel Money'
          : 'Card'
      }`,
      reference: generateTransactionId(),
      status: 'completed', // In real implementation, this would be 'pending' until payment gateway confirms
      metadata: {
        paymentMethod: data.paymentMethod,
        phoneNumber: data.phoneNumber,
        cardLast4: data.cardLast4,
        cardBrand: data.cardBrand,
        fee: data.fee || 0,
      },
    });

    if (!transactionResult.success || !transactionResult.data) {
      return {
        success: false,
        error: transactionResult.error || 'Failed to create transaction',
      };
    }

    // Get updated wallet balance
    const updatedWalletResult = await getOrCreateWallet(data.userId);
    if (!updatedWalletResult.success || !updatedWalletResult.data) {
      return {
        success: false,
        error: 'Failed to get updated wallet',
      };
    }

    return {
      success: true,
      data: {
        wallet: updatedWalletResult.data,
        transaction: transactionResult.data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process top-up',
    };
  }
}
