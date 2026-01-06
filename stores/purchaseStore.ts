import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AvailablePackage, PurchaseStatus } from '@/types';

interface PurchaseState {
  // Selected package
  selectedPackage: AvailablePackage | null;

  // Purchase flow data
  paymentMethod: 'wallet' | 'mobile_money';
  termsAccepted: boolean;

  // Status
  status: PurchaseStatus;
  errorMessage: string | null;

  // Actions
  setSelectedPackage: (pkg: AvailablePackage | null) => void;
  setPaymentMethod: (method: 'wallet' | 'mobile_money') => void;
  setTermsAccepted: (accepted: boolean) => void;
  setStatus: (status: PurchaseStatus) => void;
  setErrorMessage: (message: string | null) => void;
  resetPurchase: () => void;
}

const initialState = {
  selectedPackage: null,
  paymentMethod: 'wallet' as const,
  termsAccepted: false,
  status: 'idle' as PurchaseStatus,
  errorMessage: null,
};

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
      setStatus: (status) => set({ status }),
      setErrorMessage: (message) => set({ errorMessage: message }),
      resetPurchase: () => set(initialState),
    }),
    {
      name: 'purchase-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
