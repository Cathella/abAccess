"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultScreen } from "@/components/common/ResultScreen";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { usePackageStore } from "@/stores/packageStore";
import { useWalletStore } from "@/stores/walletStore";
import { useAuthStore } from "@/stores/authStore";
import { PACKAGE_CATEGORIES } from "@/lib/constants";
import type { UserPackageType, PackageCategoryType, BrowsePackageCategory } from "@/types";

// Helper to map BrowsePackageCategory to PackageCategoryType
const mapCategoryType = (category: BrowsePackageCategory): PackageCategoryType => {
  const mapping: Record<BrowsePackageCategory, PackageCategoryType> = {
    'consultations': 'consultations',
    'lab_tests': 'lab_tests',
    'maternal_care': 'maternity',
    'child_wellness': 'maternity', // Map to available type
    'pharmacy': 'pharmacy',
  };
  return mapping[category];
};

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const { selectedPackage, paymentMethod, resetPurchase } = usePurchaseStore();
  const addUserPackage = usePackageStore((state) => state.addUserPackage);
  const { deductBalance, addTransaction } = useWalletStore();
  const user = useAuthStore((state) => state.user);

  // Get category name
  const categoryName = selectedPackage
    ? PACKAGE_CATEGORIES.find((cat) => cat.id === selectedPackage.categoryId)?.name || ""
    : "";

  // Calculate expiry date
  const getExpiryDate = (): Date => {
    const expiryDate = new Date();
    if (selectedPackage) {
      expiryDate.setDate(expiryDate.getDate() + selectedPackage.validityDays);
    }
    return expiryDate;
  };

  // Format date as "4 Jan 2025"
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Process purchase on mount
  useEffect(() => {
    if (!selectedPackage || !user) {
      router.push("/packages");
      return;
    }

    const processPurchase = async () => {
      try {
        // Save to Supabase database using the browse package data
        const { purchasePackageWithData } = await import('@/lib/packages');
        const result = await purchasePackageWithData(user.id, {
          id: selectedPackage.id,
          name: selectedPackage.name,
          category: mapCategoryType(selectedPackage.categoryId),
          price: selectedPackage.price,
          visits: selectedPackage.visits,
          validityDays: selectedPackage.validityDays,
          copay: selectedPackage.copay,
          facilities: selectedPackage.partnerCount,
          description: `${selectedPackage.visits} visits pack`,
        });

        if (result.success && result.userPackage) {
          // Add to local package store
          addUserPackage(result.userPackage);

          // Deduct from wallet if paid with wallet
          if (paymentMethod === "wallet") {
            deductBalance(selectedPackage.price);

            // Add transaction record
            addTransaction({
              id: `txn-${Date.now()}`,
              type: "purchase",
              amount: selectedPackage.price,
              fee: 0,
              status: "completed",
              paymentMethod: "mtn_momo", // Placeholder
              packageName: selectedPackage.name,
              packageVisits: selectedPackage.visits,
              transactionId: `TXN-2025-${String(Math.floor(Math.random() * 10000)).padStart(5, "0")}`,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          // If database save fails, fallback to local-only storage
          console.error('Failed to save package to database:', result.error);

          // Create local UserPackage record as fallback
          const purchaseDate = new Date();
          const expiryDate = getExpiryDate();

          const userPackage: UserPackageType = {
            id: `pkg-${Date.now()}`,
            userId: user.id,
            packageId: selectedPackage.id,
            package: {
              id: selectedPackage.id,
              name: selectedPackage.name,
              category: mapCategoryType(selectedPackage.categoryId),
              description: `${selectedPackage.visits} visits pack`,
              price: selectedPackage.price,
              visits: selectedPackage.visits,
              validityDays: selectedPackage.validityDays,
              copay: selectedPackage.copay,
              facilities: selectedPackage.partnerCount,
            },
            purchaseDate: purchaseDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            totalVisits: selectedPackage.visits,
            usedVisits: 0,
            remainingVisits: selectedPackage.visits,
            status: "active",
            usageHistory: [],
          };

          addUserPackage(userPackage);

          if (paymentMethod === "wallet") {
            deductBalance(selectedPackage.price);
            addTransaction({
              id: `txn-${Date.now()}`,
              type: "purchase",
              amount: selectedPackage.price,
              fee: 0,
              status: "completed",
              paymentMethod: "mtn_momo",
              packageName: selectedPackage.name,
              packageVisits: selectedPackage.visits,
              transactionId: `TXN-2025-${String(Math.floor(Math.random() * 10000)).padStart(5, "0")}`,
              createdAt: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error('Error processing purchase:', error);
      }
    };

    processPurchase();

    // Clear purchase store on cleanup
    return () => {
      resetPurchase();
    };
  }, []);

  if (!selectedPackage) {
    return null;
  }

  const expiryDate = getExpiryDate();

  return (
    <ResultScreen
      emoji="😍"
      title="Package purchased!"
      subtitle=""
      primaryAction={{
        label: "View my packages",
        onPress: () => router.push("/my-packages"),
      }}
      secondaryAction={{
        label: "Done",
        onPress: () => router.push("/dashboard"),
      }}
    >
      {/* Package summary card */}
      <div className="bg-white rounded-2xl border border-neutral-400 shadow-sm p-6 space-y-4 mb-6">
        {/* Category and Package name */}
        <div className="text-center space-y-1">
          <h2 className="font-bold text-xl text-neutral-900">{categoryName}</h2>
          <p className="text-gray-500">{selectedPackage.name}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-400" />

        {/* Details grid */}
        <div className="space-y-3">
          {/* Visits available */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Visits available</span>
            <span className="font-semibold text-neutral-900">
              {selectedPackage.visits}
            </span>
          </div>

          {/* Expires */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Expires</span>
            <span className="font-semibold text-neutral-900">
              {formatDate(expiryDate)}
            </span>
          </div>

          {/* Paid */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Paid</span>
            <span className="font-semibold text-neutral-900">
              {formatCurrency(selectedPackage.price)}
            </span>
          </div>

          {/* Co-pay per visit */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Co-pay per visit</span>
            <span className="font-semibold text-neutral-900">
              {formatCurrency(selectedPackage.copay)}
            </span>
          </div>
        </div>
      </div>
    </ResultScreen>
  );
}
