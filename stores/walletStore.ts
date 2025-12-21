import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Wallet, Transaction, TransactionType } from '@/types'

interface WalletState {
  // State
  wallet: Wallet | null
  transactions: Transaction[]
  isLoading: boolean
  topUpAmount: number

  // Actions
  setWallet: (wallet: Wallet | null) => void
  setTransactions: (transactions: Transaction[]) => void
  setTopUpAmount: (amount: number) => void
  setLoading: (isLoading: boolean) => void
  addTransaction: (transaction: Transaction) => void
  updateBalance: (newBalance: number) => void
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void

  // Computed getters
  getTransactionsByType: (type: TransactionType) => Transaction[]
  getRecentTransactions: (limit?: number) => Transaction[]
  getPendingTransactions: () => Transaction[]
  getTotalTopUps: () => number
  getTotalPurchases: () => number
}

export const useWalletStore = create<WalletState>()(
  immer((set, get) => ({
    // Initial state
    wallet: null,
    transactions: [],
    isLoading: false,
    topUpAmount: 0,

    // Actions
    setWallet: (wallet) =>
      set((state) => {
        state.wallet = wallet
      }),

    setTransactions: (transactions) =>
      set((state) => {
        state.transactions = transactions
      }),

    setTopUpAmount: (amount) =>
      set((state) => {
        state.topUpAmount = amount
      }),

    setLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading
      }),

    addTransaction: (transaction) =>
      set((state) => {
        state.transactions.unshift(transaction)
      }),

    updateBalance: (newBalance) =>
      set((state) => {
        if (state.wallet) {
          state.wallet.balance = newBalance
          state.wallet.updatedAt = new Date().toISOString()
        }
      }),

    updateTransaction: (transactionId, updates) =>
      set((state) => {
        const index = state.transactions.findIndex(txn => txn.id === transactionId)
        if (index !== -1) {
          state.transactions[index] = {
            ...state.transactions[index],
            ...updates
          }
        }
      }),

  // Computed getters
  getTransactionsByType: (type) => {
    const { transactions } = get()
    return transactions.filter((txn) => txn.type === type)
  },

  getRecentTransactions: (limit = 10) => {
    const { transactions } = get()
    return transactions
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
  },

  getPendingTransactions: () => {
    const { transactions } = get()
    return transactions.filter((txn) => txn.status === 'pending')
  },

  getTotalTopUps: () => {
    const { transactions } = get()
    return transactions
      .filter((txn) => txn.type === 'topUp' && txn.status === 'completed')
      .reduce((total, txn) => total + txn.amount, 0)
  },

  getTotalPurchases: () => {
    const { transactions } = get()
    return transactions
      .filter((txn) => txn.type === 'purchase' && txn.status === 'completed')
      .reduce((total, txn) => total + txn.amount, 0)
  },
  }))
)
