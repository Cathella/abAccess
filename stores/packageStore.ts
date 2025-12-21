import { create } from "zustand";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
}

interface PackageState {
  packages: Package[];
  loading: boolean;
  fetchPackages: () => Promise<void>;
  purchasePackage: (packageId: string) => Promise<void>;
}

export const usePackageStore = create<PackageState>((set) => ({
  packages: [],
  loading: false,
  fetchPackages: async () => {
    set({ loading: true });
    // TODO: Implement API call
    set({ loading: false });
  },
  purchasePackage: async (packageId: string) => {
    set({ loading: true });
    // TODO: Implement API call
    console.log("Purchasing package:", packageId);
    set({ loading: false });
  },
}));
