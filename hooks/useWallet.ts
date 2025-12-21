"use client";

import { useWalletStore } from "@/stores/walletStore";

export function useWallet() {
  const wallet = useWalletStore((state) => state.wallet);
  const transactions = useWalletStore((state) => state.transactions);
  const isLoading = useWalletStore((state) => state.isLoading);
  const topUpAmount = useWalletStore((state) => state.topUpAmount);
  const setWallet = useWalletStore((state) => state.setWallet);
  const setTransactions = useWalletStore((state) => state.setTransactions);
  const setTopUpAmount = useWalletStore((state) => state.setTopUpAmount);
  const addTransaction = useWalletStore((state) => state.addTransaction);
  const updateBalance = useWalletStore((state) => state.updateBalance);
  const getRecentTransactions = useWalletStore((state) => state.getRecentTransactions);
  const getPendingTransactions = useWalletStore((state) => state.getPendingTransactions);
  const getTotalTopUps = useWalletStore((state) => state.getTotalTopUps);
  const getTotalPurchases = useWalletStore((state) => state.getTotalPurchases);

  return {
    wallet,
    balance: wallet?.balance || 0,
    transactions,
    isLoading,
    topUpAmount,
    setWallet,
    setTransactions,
    setTopUpAmount,
    addTransaction,
    updateBalance,
    getRecentTransactions,
    getPendingTransactions,
    getTotalTopUps,
    getTotalPurchases,
  };
}
