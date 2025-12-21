"use client";

import { usePackageStore } from "@/stores/packageStore";

export function usePackages() {
  const packages = usePackageStore((state) => state.packages);
  const userPackages = usePackageStore((state) => state.userPackages);
  const selectedPackage = usePackageStore((state) => state.selectedPackage);
  const isLoading = usePackageStore((state) => state.isLoading);
  const setPackages = usePackageStore((state) => state.setPackages);
  const setUserPackages = usePackageStore((state) => state.setUserPackages);
  const selectPackage = usePackageStore((state) => state.selectPackage);
  const clearSelection = usePackageStore((state) => state.clearSelection);
  const purchasePackage = usePackageStore((state) => state.purchasePackage);
  const getActivePackages = usePackageStore((state) => state.getActivePackages);
  const getExpiredPackages = usePackageStore((state) => state.getExpiredPackages);
  const getTotalVisitsRemaining = usePackageStore((state) => state.getTotalVisitsRemaining);

  return {
    packages,
    userPackages,
    selectedPackage,
    isLoading,
    setPackages,
    setUserPackages,
    selectPackage,
    clearSelection,
    purchasePackage,
    getActivePackages,
    getExpiredPackages,
    getTotalVisitsRemaining,
  };
}
