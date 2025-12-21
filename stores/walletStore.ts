import { create } from "zustand";

interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  date: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  fetchBalance: () => Promise<void>;
  addFunds: (amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  transactions: [],
  loading: false,
  fetchBalance: async () => {
    set({ loading: true });
    // TODO: Implement API call
    set({ loading: false });
  },
  addFunds: async (amount: number) => {
    set({ loading: true });
    // TODO: Implement API call
    console.log("Adding funds:", amount);
    set({ loading: false });
  },
}));
