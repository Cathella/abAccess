"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores/walletStore";

export default function TopUpProcessingPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const paymentMethod = topUpData.paymentMethod;

  useEffect(() => {
    // Route protection: Require amount and payment method
    if (!topUpData.amount || topUpData.amount <= 0 || !paymentMethod) {
      router.replace("/wallet/top-up");
      return;
    }

    // Prevent back navigation
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Push initial state
    window.history.pushState(null, "", window.location.href);

    // Listen for back button
    window.addEventListener("popstate", preventBack);

    // Simulate payment processing (2-3 seconds)
    const processingTime = 2000 + Math.random() * 1000; // 2-3 seconds

    const timer = setTimeout(() => {
      const isMobileMoney =
        paymentMethod === "mtn_momo" || paymentMethod === "airtel_money";

      if (isMobileMoney) {
        // For mobile money: redirect to pending page
        router.push("/wallet/top-up/pending");
      } else {
        // For card: simulate success/failure (90% success rate for demo)
        const isSuccess = Math.random() > 0.1;
        if (isSuccess) {
          router.push("/wallet/top-up/success");
        } else {
          router.push("/wallet/top-up/failed");
        }
      }
    }, processingTime);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", preventBack);
    };
  }, [paymentMethod, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <svg
            className="animate-spin"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#3A8DFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="140 44"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-xl font-bold text-neutral-900">
          Processing payment...
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-base text-neutral-600">
          Please don&apos;t close the app.
        </p>
      </div>
    </div>
  );
}
