"use client";

import { useWalletStore } from "@/stores/walletStore";

export function useWallet() {
  const balance = useWalletStore((state) => state.balance);
  const transactions = useWalletStore((state) => state.transactions);
  const loading = useWalletStore((state) => state.loading);
  const fetchBalance = useWalletStore((state) => state.fetchBalance);
  const addFunds = useWalletStore((state) => state.addFunds);

  return {
    balance,
    transactions,
    loading,
    fetchBalance,
    addFunds,
  };
}
