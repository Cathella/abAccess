/**
 * Migrate Wallet Data from localStorage to Database
 *
 * This utility migrates existing wallet data from localStorage to the database.
 * It runs once per user on first app load after the database persistence update.
 */

import * as walletService from '../services/walletService';
import * as paymentMethodService from '../services/paymentMethodService';
import type { WalletTransaction, SavedPaymentMethod } from '@/types';
import { logger } from '../utils/logger';

const MIGRATION_FLAG_KEY = 'wallet-storage_migrated';
const WALLET_STORAGE_KEY = 'wallet-storage';

interface MigrationResult {
  success: boolean;
  migrated: {
    transactions: number;
    paymentMethods: number;
    balance: number;
  };
  error?: string;
}

/**
 * Get payment method provider name
 */
function getProviderName(type: string): string {
  switch (type) {
    case 'mtn_momo':
      return 'MTN Mobile Money';
    case 'airtel_money':
      return 'Airtel Money';
    case 'card':
      return 'Card';
    default:
      return type;
  }
}

/**
 * Generate transaction description from WalletTransaction
 */
function generateTransactionDescription(tx: WalletTransaction): string {
  if (tx.type === 'top_up') {
    const methodName =
      tx.paymentMethod === 'mtn_momo'
        ? 'MTN Mobile Money'
        : tx.paymentMethod === 'airtel_money'
        ? 'Airtel Money'
        : 'Card';
    return `Top up via ${methodName}`;
  } else if (tx.type === 'purchase') {
    return `Package purchase: ${tx.packageName || 'Unknown'}`;
  }
  return 'Transaction';
}

/**
 * Migrate wallet data from localStorage to database
 */
export async function migrateWalletDataToDatabase(
  userId: string
): Promise<MigrationResult> {
  try {
    logger.info('Starting wallet data migration', { userId });

    // Check if migration already done
    const migrated = localStorage.getItem(MIGRATION_FLAG_KEY);
    if (migrated === 'true') {
      logger.info('Wallet data already migrated');
      return {
        success: true,
        migrated: { transactions: 0, paymentMethods: 0, balance: 0 },
      };
    }

    // Get localStorage data
    const walletStorageRaw = localStorage.getItem(WALLET_STORAGE_KEY);
    if (!walletStorageRaw) {
      logger.info('No wallet data found in localStorage');
      // Set migration flag even if no data to migrate
      localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
      return {
        success: true,
        migrated: { transactions: 0, paymentMethods: 0, balance: 0 },
      };
    }

    const walletStorage = JSON.parse(walletStorageRaw);
    const { balance, transactions, savedPaymentMethods } = walletStorage.state || {};

    // Get or create wallet in database
    const walletResult = await walletService.getOrCreateWallet(userId);
    if (!walletResult.success || !walletResult.data) {
      return {
        success: false,
        migrated: { transactions: 0, paymentMethods: 0, balance: 0 },
        error: walletResult.error || 'Failed to create wallet',
      };
    }

    const wallet = walletResult.data;
    let migratedTransactions = 0;
    let migratedPaymentMethods = 0;
    let migratedBalance = 0;

    // Migrate transactions
    if (transactions && Array.isArray(transactions) && transactions.length > 0) {
      logger.info(`Migrating ${transactions.length} transactions...`);

      for (const tx of transactions) {
        try {
          const result = await walletService.addTransaction({
            walletId: wallet.id,
            type: tx.type,
            amount: tx.amount,
            description: generateTransactionDescription(tx),
            reference: tx.transactionId,
            status: tx.status,
            metadata: {
              paymentMethod: tx.paymentMethod,
              phoneNumber: tx.phoneNumber,
              cardLast4: tx.cardLast4,
              cardBrand: tx.cardBrand,
              packageName: tx.packageName,
              packageVisits: tx.packageVisits,
              fee: tx.fee || 0,
            },
          });

          if (result.success) {
            migratedTransactions++;
          } else {
            logger.error('Failed to migrate transaction', { tx, error: result.error });
          }
        } catch (error) {
          logger.error('Error migrating transaction', error);
        }
      }
    }

    // Migrate payment methods
    if (
      savedPaymentMethods &&
      Array.isArray(savedPaymentMethods) &&
      savedPaymentMethods.length > 0
    ) {
      logger.info(`Migrating ${savedPaymentMethods.length} payment methods...`);

      for (const pm of savedPaymentMethods) {
        try {
          // Check for duplicates before adding
          const existingMethods = await paymentMethodService.getPaymentMethods(userId);
          const duplicate =
            existingMethods.success &&
            existingMethods.data?.some(
              (existing) =>
                existing.type === pm.type &&
                (existing.phoneNumber === pm.phoneNumber ||
                  existing.cardLast4 === pm.cardLast4)
            );

          if (duplicate) {
            logger.info('Skipping duplicate payment method', { type: pm.type });
            continue;
          }

          const result = await paymentMethodService.addPaymentMethod({
            userId,
            type: pm.type,
            provider: getProviderName(pm.type),
            accountNumber: pm.phoneNumber || pm.cardLast4 || '',
            isDefault: pm.isDefault || false,
          });

          if (result.success) {
            migratedPaymentMethods++;
          } else {
            logger.error('Failed to migrate payment method', {
              pm,
              error: result.error,
            });
          }
        } catch (error) {
          logger.error('Error migrating payment method', error);
        }
      }
    }

    // Migrate balance if it's different from wallet balance
    if (balance && typeof balance === 'number' && balance > 0) {
      const currentBalance = wallet.balance;

      if (Math.abs(currentBalance - balance) > 0.01) {
        logger.info(`Updating wallet balance from ${currentBalance} to ${balance}`);

        const balanceResult = await walletService.updateWalletBalance(wallet.id, balance);
        if (balanceResult.success) {
          migratedBalance = balance;
        } else {
          logger.error('Failed to migrate balance', balanceResult.error);
        }
      }
    }

    // Set migration flag
    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');

    logger.info('Wallet data migration completed', {
      transactions: migratedTransactions,
      paymentMethods: migratedPaymentMethods,
      balance: migratedBalance,
    });

    return {
      success: true,
      migrated: {
        transactions: migratedTransactions,
        paymentMethods: migratedPaymentMethods,
        balance: migratedBalance,
      },
    };
  } catch (error) {
    logger.error('Wallet data migration failed', error);
    return {
      success: false,
      migrated: { transactions: 0, paymentMethods: 0, balance: 0 },
      error: error instanceof Error ? error.message : 'Migration failed',
    };
  }
}

/**
 * Check if migration has been completed
 */
export function isMigrationCompleted(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
}

/**
 * Reset migration flag (for testing/development)
 */
export function resetMigrationFlag(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MIGRATION_FLAG_KEY);
}
