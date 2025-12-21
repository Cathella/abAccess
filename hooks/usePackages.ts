"use client";

import { usePackageStore } from "@/stores/packageStore";

export function usePackages() {
  const packages = usePackageStore((state) => state.packages);
  const loading = usePackageStore((state) => state.loading);
  const fetchPackages = usePackageStore((state) => state.fetchPackages);
  const purchasePackage = usePackageStore((state) => state.purchasePackage);

  return {
    packages,
    loading,
    fetchPackages,
    purchasePackage,
  };
}
