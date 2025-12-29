"use client";

import { usePackageStore } from "@/stores/packageStore";

export function usePackages() {
  const availablePackages = usePackageStore((state) => state.availablePackages);
  const userPackages = usePackageStore((state) => state.userPackages);
  const selectedPackage = usePackageStore((state) => state.selectedPackage);
  const isLoading = usePackageStore((state) => state.isLoading);
  const packageFilter = usePackageStore((state) => state.packageFilter);
  const hasInitialized = usePackageStore((state) => state.hasInitialized);
  const setAvailablePackages = usePackageStore((state) => state.setAvailablePackages);
  const setUserPackages = usePackageStore((state) => state.setUserPackages);
  const addUserPackage = usePackageStore((state) => state.addUserPackage);
  const updateUserPackage = usePackageStore((state) => state.updateUserPackage);
  const selectPackage = usePackageStore((state) => state.selectPackage);
  const setPackageFilter = usePackageStore((state) => state.setPackageFilter);
  const setLoading = usePackageStore((state) => state.setLoading);
  const recordUsage = usePackageStore((state) => state.recordUsage);
  const loadUserPackages = usePackageStore((state) => state.loadUserPackages);
  const loadMockData = usePackageStore((state) => state.loadMockData);

  return {
    availablePackages,
    userPackages,
    selectedPackage,
    isLoading,
    packageFilter,
    hasInitialized,
    setAvailablePackages,
    setUserPackages,
    addUserPackage,
    updateUserPackage,
    selectPackage,
    setPackageFilter,
    setLoading,
    recordUsage,
    loadUserPackages,
    loadMockData,
  };
}
