import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { WalletTransaction, SavedPaymentMethod, TopUpData } from '@/types';
import * as walletService from '@/lib/services/walletService';
import * as paymentMethodService from '@/lib/services/paymentMethodService';
import { networkQueue, type QueuedOperation } from '@/lib/utils/networkQueue';
import { logger } from '@/lib/utils/logger';

interface WalletState {
  // Balance
  balance: number;

  // Transactions
  transactions: WalletTransaction[];

  // Saved payment methods
  savedPaymentMethods: SavedPaymentMethod[];

  // Top up flow state
  topUpData: Partial<TopUpData>;

  // Loading states
  isLoading: boolean;
  isProcessing: boolean;

  // Filter
  transactionFilter: 'all' | 'top_up' | 'purchase';

  // Database sync fields
  walletId: string | null;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;

  // Network queue
  pendingOperations: QueuedOperation[];

  // Actions
  setBalance: (balance: number) => void;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => void;
  setTransactions: (transactions: WalletTransaction[]) => void;
  addTransaction: (transaction: WalletTransaction) => Promise<void>;
  setSavedPaymentMethods: (methods: SavedPaymentMethod[]) => void;
  addSavedPaymentMethod: (method: SavedPaymentMethod) => Promise<void>;
  removeSavedPaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  setTopUpData: (data: Partial<TopUpData>) => void;
  clearTopUpData: () => void;
  setLoading: (loading: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setTransactionFilter: (filter: 'all' | 'top_up' | 'purchase') => void;

  // New actions
  initializeWallet: (userId: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
  processTopUp: (data: {
    userId: string;
    amount: number;
    paymentMethod: 'mtn_momo' | 'airtel_money' | 'card';
    phoneNumber?: string;
    cardLast4?: string;
    cardBrand?: string;
    fee?: number;
    saveForFuture?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  queueOperation: (operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>) => void;
  processPendingOperations: () => Promise<void>;

  // Getters
  getFilteredTransactions: () => WalletTransaction[];
  getDefaultPaymentMethod: () => SavedPaymentMethod | undefined;
}

export const useWalletStore = create<WalletState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      balance: 0,
      transactions: [],
      savedPaymentMethods: [],
      topUpData: {},
      isLoading: false,
      isProcessing: false,
      transactionFilter: 'all',
      walletId: null,
      isSyncing: false,
      lastSyncedAt: null,
      syncError: null,
      pendingOperations: [],

      // Balance actions
      setBalance: (balance) =>
        set((state) => {
          state.balance = balance;
        }),

      addBalance: (amount) =>
        set((state) => {
          state.balance += amount;
        }),

      deductBalance: (amount) =>
        set((state) => {
          state.balance = Math.max(0, state.balance - amount);
        }),

      // Transaction actions
      setTransactions: (transactions) =>
        set((state) => {
          state.transactions = transactions;
        }),

      addTransaction: async (transaction) => {
        // Optimistic update
        set((state) => {
          state.transactions.unshift(transaction);
        });

        // Attempt server sync in background
        const walletId = get().walletId;
        if (!walletId) {
          logger.warn('Cannot sync transaction: no wallet ID');
          return;
        }

        try {
          const result = await walletService.addTransaction({
            walletId,
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.type === 'top_up' ? 'Top up' : 'Purchase'}`,
            status: transaction.status,
            metadata: {
              paymentMethod: transaction.paymentMethod,
              phoneNumber: transaction.phoneNumber,
              cardLast4: transaction.cardLast4,
              cardBrand: transaction.cardBrand,
              packageName: transaction.packageName,
              packageVisits: transaction.packageVisits,
              fee: transaction.fee,
            },
          });

          if (!result.success) {
            logger.error('Failed to sync transaction', result.error);
            // Queue for retry
            networkQueue.add({
              type: 'addTransaction',
              data: {
                walletId,
                type: transaction.type,
                amount: transaction.amount,
                description: `${transaction.type === 'top_up' ? 'Top up' : 'Purchase'}`,
                status: transaction.status,
                metadata: {
                  paymentMethod: transaction.paymentMethod,
                  phoneNumber: transaction.phoneNumber,
                  cardLast4: transaction.cardLast4,
                  cardBrand: transaction.cardBrand,
                  packageName: transaction.packageName,
                  packageVisits: transaction.packageVisits,
                  fee: transaction.fee,
                },
              },
            });
          }
        } catch (error) {
          logger.error('Error syncing transaction', error);
        }
      },

      // Payment method actions
      setSavedPaymentMethods: (methods) =>
        set((state) => {
          state.savedPaymentMethods = methods;
        }),

      addSavedPaymentMethod: async (method) => {
        // Snapshot for rollback
        const snapshot = get().savedPaymentMethods;

        // Optimistic update
        set((state) => {
          state.savedPaymentMethods = state.savedPaymentMethods.filter(
            (m) => m.type !== method.type
          );

          if (method.isDefault) {
            state.savedPaymentMethods.forEach((m) => {
              m.isDefault = false;
            });
          }
          state.savedPaymentMethods.push(method);
        });

        // Attempt server sync
        try {
          const result = await paymentMethodService.addPaymentMethod({
            userId: '', // Will be set by the caller
            type: method.type,
            provider:
              method.type === 'card' ? method.cardBrand || 'Card' : method.type === 'mtn_momo' ? 'MTN Mobile Money' : 'Airtel Money',
            accountNumber: method.phoneNumber || method.cardLast4 || '',
            isDefault: method.isDefault,
          });

          if (!result.success) {
            // Rollback on error
            set((state) => {
              state.savedPaymentMethods = snapshot;
              state.syncError = result.error || 'Failed to save payment method';
            });
            logger.error('Failed to save payment method', result.error);
          }
        } catch (error) {
          // Rollback on error
          set((state) => {
            state.savedPaymentMethods = snapshot;
            state.syncError = 'Network error';
          });
          logger.error('Error saving payment method', error);
        }
      },

      removeSavedPaymentMethod: async (id) => {
        // Snapshot for rollback
        const snapshot = get().savedPaymentMethods;

        // Optimistic update
        set((state) => {
          state.savedPaymentMethods = state.savedPaymentMethods.filter((m) => m.id !== id);
        });

        // Attempt server sync
        try {
          const result = await paymentMethodService.removePaymentMethod(id);

          if (!result.success) {
            // Rollback on error
            set((state) => {
              state.savedPaymentMethods = snapshot;
              state.syncError = result.error || 'Failed to remove payment method';
            });
            logger.error('Failed to remove payment method', result.error);
          }
        } catch (error) {
          // Rollback on error
          set((state) => {
            state.savedPaymentMethods = snapshot;
            state.syncError = 'Network error';
          });
          logger.error('Error removing payment method', error);
        }
      },

      setDefaultPaymentMethod: async (id) => {
        // Snapshot for rollback
        const snapshot = get().savedPaymentMethods.map((m) => ({ ...m }));

        // Optimistic update
        set((state) => {
          state.savedPaymentMethods.forEach((method) => {
            method.isDefault = method.id === id;
          });
        });

        // Attempt server sync
        try {
          const result = await paymentMethodService.setDefaultPaymentMethod('', id);

          if (!result.success) {
            // Rollback on error
            set((state) => {
              state.savedPaymentMethods = snapshot;
              state.syncError = result.error || 'Failed to set default payment method';
            });
            logger.error('Failed to set default payment method', result.error);
          }
        } catch (error) {
          // Rollback on error
          set((state) => {
            state.savedPaymentMethods = snapshot;
            state.syncError = 'Network error';
          });
          logger.error('Error setting default payment method', error);
        }
      },

      // Top up flow actions
      setTopUpData: (data) =>
        set((state) => {
          state.topUpData = { ...state.topUpData, ...data };
        }),

      clearTopUpData: () =>
        set((state) => {
          state.topUpData = {};
        }),

      // Loading state actions
      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setProcessing: (processing) =>
        set((state) => {
          state.isProcessing = processing;
        }),

      // Filter actions
      setTransactionFilter: (filter) =>
        set((state) => {
          state.transactionFilter = filter;
        }),

      // NEW: Initialize wallet from database
      initializeWallet: async (userId) => {
        set((state) => {
          state.isLoading = true;
          state.syncError = null;
        });

        try {
          logger.sync('Initializing wallet...');

          // Get or create wallet
          const walletResult = await walletService.getOrCreateWallet(userId);
          if (!walletResult.success || !walletResult.data) {
            throw new Error(walletResult.error || 'Failed to get wallet');
          }

          const wallet = walletResult.data;

          // Get transactions
          const transactionsResult = await walletService.getTransactions(wallet.id);
          const transactions = transactionsResult.success ? transactionsResult.data || [] : [];

          // Get payment methods
          const paymentMethodsResult = await paymentMethodService.getPaymentMethods(userId);
          const paymentMethods = paymentMethodsResult.success
            ? paymentMethodsResult.data || []
            : [];

          // Update store
          set((state) => {
            state.walletId = wallet.id;
            state.balance = wallet.balance;
            state.transactions = transactions;
            state.savedPaymentMethods = paymentMethods;
            state.lastSyncedAt = new Date().toISOString();
            state.isLoading = false;
          });

          logger.sync('Wallet initialized successfully');
        } catch (error) {
          set((state) => {
            state.syncError = error instanceof Error ? error.message : 'Failed to initialize wallet';
            state.isLoading = false;
          });
          logger.error('Failed to initialize wallet', error);
        }
      },

      // NEW: Sync with server
      syncWithServer: async () => {
        const state = get();
        if (!state.walletId) {
          logger.warn('Cannot sync: no wallet ID');
          return;
        }

        set((s) => {
          s.isSyncing = true;
        });

        try {
          // Fetch latest wallet balance
          const balanceResult = await walletService.getWalletBalance(
            state.walletId.replace(/^wallet_/, '') // Extract userId if needed
          );

          if (balanceResult.success && balanceResult.data !== undefined) {
            const serverBalance = balanceResult.data;
            const localBalance = state.balance;

            // Detect conflict
            if (Math.abs(serverBalance - localBalance) > 0.01) {
              logger.warn('Balance mismatch detected', {
                local: localBalance,
                server: serverBalance,
              });

              // Server wins
              set((s) => {
                s.balance = serverBalance;
              });
            }
          }

          // Fetch latest transactions
          const txResult = await walletService.getTransactions(state.walletId);
          if (txResult.success && txResult.data) {
            set((s) => {
              s.transactions = txResult.data || [];
            });
          }

          // Fetch latest payment methods
          const pmResult = await paymentMethodService.getPaymentMethods(
            state.walletId.replace(/^wallet_/, '')
          );
          if (pmResult.success && pmResult.data) {
            set((s) => {
              s.savedPaymentMethods = pmResult.data || [];
            });
          }

          set((s) => {
            s.lastSyncedAt = new Date().toISOString();
            s.isSyncing = false;
            s.syncError = null;
          });

          logger.sync('Sync completed successfully');
        } catch (error) {
          set((s) => {
            s.syncError = error instanceof Error ? error.message : 'Sync failed';
            s.isSyncing = false;
          });
          logger.error('Sync failed', error);
        }
      },

      // NEW: Process top-up
      processTopUp: async (data) => {
        set((state) => {
          state.isProcessing = true;
        });

        try {
          logger.transaction('topUp.started', { amount: data.amount, userId: data.userId });

          const result = await walletService.processTopUp({
            userId: data.userId,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            phoneNumber: data.phoneNumber,
            cardLast4: data.cardLast4,
            cardBrand: data.cardBrand,
            fee: data.fee || 0,
          });

          if (!result.success || !result.data) {
            set((state) => {
              state.isProcessing = false;
            });
            logger.error('topUp.failed', result.error);
            return {
              success: false,
              error: result.error || 'Failed to process top-up',
            };
          }

          // Update store with server data
          set((state) => {
            state.balance = result.data!.wallet.balance;
            state.transactions.unshift(result.data!.transaction);
            state.isProcessing = false;
          });

          // Save payment method if requested
          if (data.saveForFuture && data.phoneNumber) {
            await get().addSavedPaymentMethod({
              id: crypto.randomUUID(),
              type: data.paymentMethod,
              phoneNumber: data.phoneNumber,
              isDefault: false,
            });
          }

          logger.transaction('topUp.completed', {
            amount: data.amount,
            transactionId: result.data.transaction.id,
          });

          return { success: true };
        } catch (error) {
          set((state) => {
            state.isProcessing = false;
          });
          logger.error('topUp.error', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
          };
        }
      },

      // NEW: Queue operation for retry
      queueOperation: (operation) => {
        networkQueue.add(operation);
        set((state) => {
          state.pendingOperations = [...state.pendingOperations, {
            ...operation,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            retries: 0,
          }];
        });
      },

      // NEW: Process pending operations
      processPendingOperations: async () => {
        await networkQueue.processQueue();
        // Clear completed operations from state
        set((state) => {
          state.pendingOperations = [];
        });
      },

      // Getters
      getFilteredTransactions: () => {
        const { transactions, transactionFilter } = get();
        if (transactionFilter === 'all') {
          return transactions;
        }
        return transactions.filter((t) => t.type === transactionFilter);
      },

      getDefaultPaymentMethod: () => {
        const { savedPaymentMethods } = get();
        return savedPaymentMethods.find((m) => m.isDefault);
      },
    })),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        balance: state.balance,
        transactions: state.transactions,
        savedPaymentMethods: state.savedPaymentMethods,
        walletId: state.walletId,
        lastSyncedAt: state.lastSyncedAt,
        pendingOperations: state.pendingOperations,
        // Don't persist: topUpData, isLoading, isProcessing, transactionFilter, isSyncing, syncError
      }),
    }
  )
);
