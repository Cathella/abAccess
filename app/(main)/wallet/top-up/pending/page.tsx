"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency } from "@/lib/wallet";
import { Info, Clock, Smartphone } from "lucide-react";

export default function TopUpPendingPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const amount = topUpData.amount || 0;
  const paymentMethod = topUpData.paymentMethod;

  // Timer state (3 minutes = 180 seconds)
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [isResending, setIsResending] = useState(false);

  // Route protection: Require amount and payment method
  useEffect(() => {
    if (!topUpData.amount || topUpData.amount <= 0 || !paymentMethod) {
      router.replace("/wallet/top-up");
    }
  }, [topUpData.amount, paymentMethod, router]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Timer expired - redirect to failed screen
      router.push("/wallet/top-up/failed");
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, router]);

  // Auto-check payment status every 10 seconds (optional for MVP)
  useEffect(() => {
    const checkStatus = async () => {
      // TODO: Integrate with actual payment API
      // For MVP, this is a placeholder for future implementation
      console.log("Checking payment status...");
    };

    const interval = setInterval(checkStatus, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

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

  const handleResend = async () => {
    setIsResending(true);

    // TODO: Trigger new payment request API call
    // For MVP, just simulate the request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Restart timer
    setTimeRemaining(180);
    setIsResending(false);
  };

  const handleCompletePayment = () => {
    // Navigate to processing page which will handle success/failure
    router.push("/wallet/top-up/processing");
  };

  const getPaymentProviderName = () => {
    if (paymentMethod === "mtn_momo") return "MTN Mobile Money";
    if (paymentMethod === "airtel_money") return "Airtel Money";
    return "Mobile Money";
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Content - Centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-32">
        {/* Phone Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center">
          <Smartphone className="h-16 w-16 text-primary-900" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-center text-2xl font-bold text-neutral-900">
          Check your phone
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-center text-base leading-[160%] text-neutral-600">
          We&apos;ve sent a payment request to your {getPaymentProviderName()}{" "}
          number.
        </p>

        {/* Instructions Card */}
        <div className="w-full max-w-md rounded-xl bg-secondary-100 p-4">
          {/* Header */}
          <div className="mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-neutral-900" />
            <span className="text-sm font-semibold text-neutral-900">
              What to do now
            </span>
          </div>

          {/* Divider */}
          <div className="mb-3 h-px bg-secondary-900/20" />

          {/* Steps */}
          <ol className="space-y-2 text-sm leading-[180%] text-neutral-700">
            <li className="flex gap-2">
              <span className="font-medium">1.</span>
              <span>
                Open the {paymentMethod === "mtn_momo" ? "MTN MoMo" : "Airtel Money"}{" "}
                prompt on your phone
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">2.</span>
              <span>Enter your Mobile Money PIN</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">3.</span>
              <span>Confirm the payment of {formatCurrency(amount)}</span>
            </li>
          </ol>
        </div>

        {/* Timer */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="h-4 w-4" />
            <span>Waiting for confirmation...</span>
          </div>
          <p className="text-sm text-neutral-600">
            Expires in {formatTime(timeRemaining)}
          </p>
        </div>

        {/* Resend Link */}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="mt-6 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-70 disabled:opacity-50"
        >
          {isResending ? (
            "Resending..."
          ) : (
            <>
              Didn&apos;t receive prompt?{" "}
              <span className="text-secondary-900">Resend</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleCompletePayment}
          className="h-14 w-full rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800"
        >
          I&apos;ve completed payment
        </button>
      </div>
    </div>
  );
}
