"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { Header } from "@/components/common/Header";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { EmptyState } from "@/components/common/EmptyState";
import PackageSelectRadio from "@/components/forms/PackageSelectRadio";
import { usePackageStore } from "@/stores/packageStore";
import { useBookingStore } from "@/stores/bookingStore";
import { PackageCategory, PackageStatus } from "@/types";
import type { UserPackage, Package as PackageType, PackageCategoryType } from "@/types";

export default function SelectPackagePage() {
  const router = useRouter();
  const userPackages = usePackageStore((state) => state.userPackages);
  const { setSelectedPackage } = useBookingStore();

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Helper function to map category types
  const mapCategory = (category: PackageCategoryType): PackageCategory => {
    switch (category) {
      case "consultations":
        return PackageCategory.CONSULTATIONS;
      case "lab_tests":
        return PackageCategory.LAB_TESTS;
      case "maternity":
        return PackageCategory.MATERNITY;
      case "dental":
        return PackageCategory.DENTAL;
      case "optical":
        return PackageCategory.OPTICAL;
      case "pharmacy":
      default:
        return PackageCategory.CONSULTATIONS;
    }
  };

  // Convert UserPackageType to UserPackage
  const convertToUserPackage = (pkg: any): UserPackage => {
    const mappedPackage: PackageType = {
      id: pkg.package.id,
      name: pkg.package.name,
      description: pkg.package.description,
      price: pkg.package.price,
      visitCount: pkg.package.visits,
      validityDays: pkg.package.validityDays,
      copay: pkg.package.copay,
      category: mapCategory(pkg.package.category),
      facilities: [],
      features: [],
      isActive: true,
    };

    return {
      id: pkg.id,
      userId: pkg.userId,
      packageId: pkg.packageId,
      package: mappedPackage,
      purchaseDate: pkg.purchaseDate,
      expiryDate: pkg.expiryDate,
      visitsRemaining: pkg.remainingVisits,
      visitsUsed: pkg.usedVisits,
      status:
        pkg.status === "active"
          ? PackageStatus.ACTIVE
          : pkg.status === "completed"
          ? PackageStatus.EXHAUSTED
          : PackageStatus.EXPIRED,
    };
  };

  // Filter active packages with remaining visits
  const activePackages = useMemo(() => {
    return userPackages
      .filter((pkg) => pkg.status === "active" && pkg.remainingVisits > 0)
      .map(convertToUserPackage);
  }, [userPackages]);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
  };

  const handleContinue = () => {
    if (!selectedPackageId) return;

    const selectedPkg = activePackages.find((pkg) => pkg.id === selectedPackageId);
    if (selectedPkg) {
      setSelectedPackage(selectedPkg);
      router.push("/book/select-person");
    }
  };

  const handleBrowsePackages = () => {
    router.push("/packages");
  };

  // Show empty state if no active packages
  if (activePackages.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <Header title="Book a visit" showBack={true} />

        {/* Empty State */}
        <EmptyState
          icon={Package}
          title="No active packages"
          description="Purchase a package to book a visit"
          action={{
            label: "Browse packages",
            onClick: handleBrowsePackages,
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Book a visit" showBack={true} />

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-32">
        {/* Title & Subtitle */}
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          Select a package
        </h1>
        <p className="text-neutral-700 mb-6">
          Choose which package to use for this visit.
        </p>

        {/* Package Selection Card */}
        <div className="rounded-4xl border border-neutral-400 bg-white overflow-hidden mb-6">
          {activePackages.map((pkg, index) => (
            <PackageSelectRadio
              key={pkg.id}
              package={pkg}
              selected={selectedPackageId === pkg.id}
              onSelect={() => handleSelectPackage(pkg.id)}
              isLast={index === activePackages.length - 1}
            />
          ))}
        </div>

        {/* Browse Packages Link */}
        <div className="text-center">
          <Link
            href="/packages"
            className="text-secondary-900 font-semibold hover:underline"
          >
            Browse packages
          </Link>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <PrimaryButton onClick={handleContinue} disabled={!selectedPackageId}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
