"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores/walletStore";
import { useAuthStore } from "@/stores/authStore";
import { calculateProcessingFee } from "@/lib/wallet";

export default function TopUpProcessingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const topUpData = useWalletStore((state) => state.topUpData);
  const processTopUp = useWalletStore((state) => state.processTopUp);
  const paymentMethod = topUpData.paymentMethod;

  useEffect(() => {
    // Route protection: Require amount and payment method
    if (!topUpData.amount || topUpData.amount <= 0 || !paymentMethod || !user?.id) {
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

    // Process payment with actual service call
    const processPayment = async () => {
      try {
        const fee = calculateProcessingFee(topUpData.amount, paymentMethod);

        const result = await processTopUp({
          userId: user.id,
          amount: topUpData.amount,
          paymentMethod: paymentMethod,
          phoneNumber: topUpData.phoneNumber,
          cardLast4: topUpData.cardDetails?.number.slice(-4),
          cardBrand: topUpData.cardDetails?.number.startsWith('4') ? 'Visa' :
                      topUpData.cardDetails?.number.startsWith('5') ? 'Mastercard' : 'Card',
          fee: fee,
          saveForFuture: topUpData.saveForFuture,
        });

        if (result.success) {
          // Success - navigate to success page
          router.push("/wallet/top-up/success");
        } else {
          // Failed - navigate to failed page
          router.push("/wallet/top-up/failed");
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        router.push("/wallet/top-up/failed");
      }
    };

    // Add delay for UX (show processing animation)
    const timer = setTimeout(processPayment, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", preventBack);
    };
  }, [paymentMethod, user?.id, router, processTopUp, topUpData]);

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
