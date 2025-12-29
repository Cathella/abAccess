"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores/walletStore";
import { Info } from "lucide-react";

export default function TopUpFailedPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const clearTopUpData = useWalletStore((state) => state.clearTopUpData);
  const setTopUpData = useWalletStore((state) => state.setTopUpData);

  const amount = topUpData.amount || 0;
  const paymentMethod = topUpData.paymentMethod;

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  const handleCancel = () => {
    clearTopUpData();
    router.push("/dashboard");
  };

  const handleDifferentMethod = () => {
    // Keep the amount, clear other fields
    setTopUpData({
      amount,
      paymentMethod: undefined,
      phoneNumber: undefined,
      cardDetails: undefined,
      saveForFuture: false,
    });
    router.push("/wallet/top-up/method");
  };

  const handleTryAgain = () => {
    // Retry with same details based on payment method
    if (paymentMethod === "mtn_momo" || paymentMethod === "airtel_money") {
      router.push("/wallet/top-up/pending");
    } else if (paymentMethod === "card") {
      router.push("/wallet/top-up/processing");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-16">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center">
        {/* Error Icon */}
        <div className="mb-6 text-[64px] leading-none">🛑</div>

        {/* Title */}
        <h1 className="mb-3 text-center text-xl font-bold text-neutral-900">
          Top up failed
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-center text-base text-neutral-700">
          We couldn&apos;t process your payment.
        </p>

        {/* Error Card */}
        <div className="w-full rounded-2xl bg-secondary-100 p-4">
          {/* Header */}
          <div className="mb-3 flex items-center gap-2">
            <Info className="h-6 w-6 text-neutral-900" />
            <span className="text-base font-bold text-neutral-900">
              What went wrong
            </span>
          </div>

          {/* Divider */}
          <div className="mb-3 h-px bg-secondary-900/20" />

          {/* Body */}
          <div className="space-y-2">
            <p className="text-sm leading-[180%] text-neutral-900">
              The payment was not completed. This could be because:
            </p>
            <ul className="ml-5 list-disc space-y-1 text-sm leading-[180%] text-neutral-900">
              <li>The request timed out</li>
              <li>Insufficient balance in your Mobile Money</li>
              <li>The transaction was cancelled</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Fixed */}
      <div className="w-full pb-6 pt-4">
        {/* Cancel link */}
        <button
          onClick={handleCancel}
          className="mb-3 w-full text-center text-base font-bold text-neutral-900 transition-opacity hover:opacity-70"
        >
          Cancel
        </button>

        {/* Use different payment method Button */}
        <button
          onClick={handleDifferentMethod}
          className="mb-3 h-12 w-full rounded-xl border-[1.5px] border-neutral-900 bg-primary-100 text-base font-bold text-neutral-900 transition-colors hover:bg-primary-200"
        >
          Use different payment method
        </button>

        {/* Try again Button */}
        <button
          onClick={handleTryAgain}
          className="h-12 w-full rounded-xl bg-primary-900 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-primary-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
