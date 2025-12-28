import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { WalletTransaction, SavedPaymentMethod, TopUpData } from '@/types'

interface WalletState {
  // Balance
  balance: number

  // Transactions
  transactions: WalletTransaction[]

  // Saved payment methods
  savedPaymentMethods: SavedPaymentMethod[]

  // Top up flow state
  topUpData: Partial<TopUpData>

  // Loading states
  isLoading: boolean
  isProcessing: boolean

  // Filter
  transactionFilter: 'all' | 'top_up' | 'purchase'

  // Actions
  setBalance: (balance: number) => void
  addBalance: (amount: number) => void
  deductBalance: (amount: number) => void
  setTransactions: (transactions: WalletTransaction[]) => void
  addTransaction: (transaction: WalletTransaction) => void
  setSavedPaymentMethods: (methods: SavedPaymentMethod[]) => void
  addSavedPaymentMethod: (method: SavedPaymentMethod) => void
  removeSavedPaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
  setTopUpData: (data: Partial<TopUpData>) => void
  clearTopUpData: () => void
  setLoading: (loading: boolean) => void
  setProcessing: (processing: boolean) => void
  setTransactionFilter: (filter: 'all' | 'top_up' | 'purchase') => void

  // Getters
  getFilteredTransactions: () => WalletTransaction[]
  getDefaultPaymentMethod: () => SavedPaymentMethod | undefined
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

      // Balance actions
      setBalance: (balance) =>
        set((state) => {
          state.balance = balance
        }),

      addBalance: (amount) =>
        set((state) => {
          state.balance += amount
        }),

      deductBalance: (amount) =>
        set((state) => {
          state.balance = Math.max(0, state.balance - amount)
        }),

      // Transaction actions
      setTransactions: (transactions) =>
        set((state) => {
          state.transactions = transactions
        }),

      addTransaction: (transaction) =>
        set((state) => {
          // Add to beginning of array (most recent first)
          state.transactions.unshift(transaction)
        }),

      // Payment method actions
      setSavedPaymentMethods: (methods) =>
        set((state) => {
          state.savedPaymentMethods = methods
        }),

      addSavedPaymentMethod: (method) =>
        set((state) => {
          // If this is set as default, unset all others
          if (method.isDefault) {
            state.savedPaymentMethods.forEach((m) => {
              m.isDefault = false
            })
          }
          state.savedPaymentMethods.push(method)
        }),

      removeSavedPaymentMethod: (id) =>
        set((state) => {
          state.savedPaymentMethods = state.savedPaymentMethods.filter(
            (m) => m.id !== id
          )
        }),

      setDefaultPaymentMethod: (id) =>
        set((state) => {
          state.savedPaymentMethods.forEach((method) => {
            method.isDefault = method.id === id
          })
        }),

      // Top up flow actions
      setTopUpData: (data) =>
        set((state) => {
          state.topUpData = { ...state.topUpData, ...data }
        }),

      clearTopUpData: () =>
        set((state) => {
          state.topUpData = {}
        }),

      // Loading state actions
      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),

      setProcessing: (processing) =>
        set((state) => {
          state.isProcessing = processing
        }),

      // Filter actions
      setTransactionFilter: (filter) =>
        set((state) => {
          state.transactionFilter = filter
        }),

      // Getters
      getFilteredTransactions: () => {
        const { transactions, transactionFilter } = get()
        if (transactionFilter === 'all') {
          return transactions
        }
        return transactions.filter((t) => t.type === transactionFilter)
      },

      getDefaultPaymentMethod: () => {
        const { savedPaymentMethods } = get()
        return savedPaymentMethods.find((m) => m.isDefault)
      },
    })),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        balance: state.balance,
        transactions: state.transactions,
        savedPaymentMethods: state.savedPaymentMethods,
        // Don't persist: topUpData, isLoading, isProcessing, transactionFilter
      }),
    }
  )
)
