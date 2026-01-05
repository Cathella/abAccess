"use client";

import { useRouter } from "next/navigation";
import { ResultScreen } from "@/components/common/ResultScreen";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { PACKAGE_CATEGORIES } from "@/lib/constants";

export default function PurchaseFailedPage() {
  const router = useRouter();
  const { selectedPackage, paymentMethod } = usePurchaseStore();

  // Get category name
  const categoryName = selectedPackage
    ? PACKAGE_CATEGORIES.find((cat) => cat.id === selectedPackage.categoryId)?.name || ""
    : "";

  // Redirect if no package selected
  if (!selectedPackage) {
    router.push("/packages");
    return null;
  }

  const handleTryAgain = () => {
    // Navigate based on payment method
    if (paymentMethod === "wallet") {
      router.push("/packages/purchase/pin");
    } else {
      router.push("/packages/purchase/processing");
    }
  };

  const handleChooseDifferentPayment = () => {
    router.push("/packages/purchase/confirm");
  };

  return (
    <ResultScreen
      emoji="😫"
      title="Payment failed"
      subtitle="We couldn't process your payment. Please check your balance and try again."
      primaryAction={{
        label: "Try again",
        onPress: handleTryAgain,
      }}
      secondaryAction={{
        label: "Choose different payment",
        onPress: handleChooseDifferentPayment,
      }}
    >
      {/* Package info card */}
      <div className="bg-white rounded-2xl border border-neutral-400 p-6 mb-6">
        {/* Category and Package name */}
        <div className="text-center space-y-1">
          <h2 className="font-bold text-neutral-900">{categoryName}</h2>
          <p className="text-gray-500">{selectedPackage.name}</p>
        </div>
      </div>
    </ResultScreen>
  );
}
