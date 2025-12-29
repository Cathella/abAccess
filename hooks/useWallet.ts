"use client";

import { useWalletStore } from "@/stores/walletStore";

export function useWallet() {
  const balance = useWalletStore((state) => state.balance);
  const transactions = useWalletStore((state) => state.transactions);
  const isLoading = useWalletStore((state) => state.isLoading);
  const isProcessing = useWalletStore((state) => state.isProcessing);
  const topUpData = useWalletStore((state) => state.topUpData);
  const savedPaymentMethods = useWalletStore((state) => state.savedPaymentMethods);
  const transactionFilter = useWalletStore((state) => state.transactionFilter);

  const setBalance = useWalletStore((state) => state.setBalance);
  const addBalance = useWalletStore((state) => state.addBalance);
  const deductBalance = useWalletStore((state) => state.deductBalance);
  const setTransactions = useWalletStore((state) => state.setTransactions);
  const addTransaction = useWalletStore((state) => state.addTransaction);
  const setSavedPaymentMethods = useWalletStore((state) => state.setSavedPaymentMethods);
  const addSavedPaymentMethod = useWalletStore((state) => state.addSavedPaymentMethod);
  const removeSavedPaymentMethod = useWalletStore((state) => state.removeSavedPaymentMethod);
  const setDefaultPaymentMethod = useWalletStore((state) => state.setDefaultPaymentMethod);
  const setTopUpData = useWalletStore((state) => state.setTopUpData);
  const clearTopUpData = useWalletStore((state) => state.clearTopUpData);
  const setLoading = useWalletStore((state) => state.setLoading);
  const setProcessing = useWalletStore((state) => state.setProcessing);
  const setTransactionFilter = useWalletStore((state) => state.setTransactionFilter);
  const getFilteredTransactions = useWalletStore((state) => state.getFilteredTransactions);
  const getDefaultPaymentMethod = useWalletStore((state) => state.getDefaultPaymentMethod);

  return {
    balance,
    transactions,
    isLoading,
    isProcessing,
    topUpData,
    savedPaymentMethods,
    transactionFilter,
    setBalance,
    addBalance,
    deductBalance,
    setTransactions,
    addTransaction,
    setSavedPaymentMethods,
    addSavedPaymentMethod,
    removeSavedPaymentMethod,
    setDefaultPaymentMethod,
    setTopUpData,
    clearTopUpData,
    setLoading,
    setProcessing,
    setTransactionFilter,
    getFilteredTransactions,
    getDefaultPaymentMethod,
  };
}
