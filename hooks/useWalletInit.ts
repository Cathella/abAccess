/**
 * Wallet Initialization Hook
 *
 * Automatically initializes the wallet when user authenticates:
 * 1. Checks for and runs one-time data migration from localStorage
 * 2. Loads wallet data from database
 * 3. Syncs transactions and payment methods
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useWalletStore } from '@/stores/walletStore';
import { migrateWalletDataToDatabase, isMigrationCompleted } from '@/lib/migrations/migrateWalletData';
import { logger } from '@/lib/utils/logger';

export function useWalletInit() {
  const user = useAuthStore((state) => state.user);
  const initializeWallet = useWalletStore((state) => state.initializeWallet);
  const processPendingOperations = useWalletStore((state) => state.processPendingOperations);

  // Track if initialization has been attempted
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once when user is available
    if (!user?.id || hasInitialized.current) return;

    const init = async () => {
      try {
        logger.info('Starting wallet initialization', { userId: user.id });

        // Check and run migration if needed
        if (!isMigrationCompleted()) {
          logger.info('Running wallet data migration...');
          const migrationResult = await migrateWalletDataToDatabase(user.id);

          if (migrationResult.success) {
            logger.info('Migration completed successfully', migrationResult.migrated);
          } else {
            logger.error('Migration failed', migrationResult.error);
            // Continue with initialization even if migration fails
          }
        }

        // Initialize wallet from database
        await initializeWallet(user.id);

        // Process any pending operations from network queue
        await processPendingOperations();

        hasInitialized.current = true;
        logger.info('Wallet initialization complete');
      } catch (error) {
        logger.error('Wallet initialization error', error);
      }
    };

    init();
  }, [user?.id, initializeWallet, processPendingOperations]);

  // Return initialization status
  const isLoading = useWalletStore((state) => state.isLoading);
  const syncError = useWalletStore((state) => state.syncError);
  const walletId = useWalletStore((state) => state.walletId);

  return {
    isInitialized: hasInitialized.current && !!walletId,
    isLoading,
    error: syncError,
  };
}
