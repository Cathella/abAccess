"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { useWalletStore } from "@/stores/walletStore";

export default function ProcessingPaymentPage() {
  const router = useRouter();
  const { paymentMethod, selectedPackage } = usePurchaseStore();
  const balance = useWalletStore((state) => state.balance);

  useEffect(() => {
    if (!selectedPackage) {
      router.replace("/packages");
      return;
    }

    // Simulate payment processing with 2-3 second delay
    const delay = Math.random() * 1000 + 2000; // Random delay between 2000-3000ms

    const timer = setTimeout(() => {
      if (paymentMethod === "wallet") {
        const hasSufficientBalance = balance >= selectedPackage.price;
        router.push(
          hasSufficientBalance
            ? "/packages/purchase/success"
            : "/packages/purchase/failed"
        );
        return;
      }

      // 80% chance of success, 20% chance of failure for mobile money
      const random = Math.random();
      router.push(
        random < 0.8 ? "/packages/purchase/success" : "/packages/purchase/failed"
      );
    }, delay);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [balance, paymentMethod, router, selectedPackage]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {/* Spinner */}
      <Loader2
        className="h-16 w-16 animate-spin mb-6"
        style={{ color: "#3A8DFF" }}
      />

      {/* Processing text */}
      <h1 className="font-bold text-xl text-neutral-900 mb-2">
        Processing payment...
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-center">
        Please don't close the app.
      </p>
    </div>
  );
}
