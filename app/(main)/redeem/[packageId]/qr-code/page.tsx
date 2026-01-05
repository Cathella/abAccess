"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import QRCodeDisplay from "@/components/common/QRCodeDisplay";
import { useRedemptionStore } from "@/stores/redemptionStore";

export default function QRCodePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;

  const {
    session,
    timeRemaining,
    isCodeExpiring,
    resetRedemption,
    stopTimer,
    setRedemptionSuccess,
    setRedemptionFailed,
  } = useRedemptionStore();

  // Demo/testing: Simulate facility scan after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Randomly simulate success or failure
      const isSuccess = Math.random() > 0.3; // 70% success rate

      if (isSuccess) {
        setRedemptionSuccess({
          facilityName: "Mukono Family Clinic",
          visitDate: new Date().toISOString(),
          visitTime: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          copayPaid: session?.package?.package.copay || 5000,
          remainingVisits: (session?.package?.remainingVisits || 1) - 1,
        });
      } else {
        setRedemptionFailed();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [session, setRedemptionSuccess, setRedemptionFailed]);

  // Redirect if no active code
  useEffect(() => {
    if (!session || !session.activeCode) {
      router.push("/my-packages");
    }
  }, [session, router]);

  // Watch for status changes and navigate accordingly
  useEffect(() => {
    if (!session) return;

    switch (session.status) {
      case 'code_expired':
        router.push(`/redeem/${packageId}/expired`);
        break;
      case 'code_already_used':
        router.push(`/redeem/${packageId}/already-used`);
        break;
      case 'success':
        router.push(`/redeem/${packageId}/success`);
        break;
      case 'failed':
        router.push(`/redeem/${packageId}/failed`);
        break;
    }
  }, [session?.status, packageId, router]);

  // Cleanup timer on unmount (if not navigating to result pages)
  useEffect(() => {
    return () => {
      // Only stop timer if we're not on a result page
      const currentPath = window.location.pathname;
      const isResultPage = currentPath.includes('/success') ||
                          currentPath.includes('/failed') ||
                          currentPath.includes('/expired') ||
                          currentPath.includes('/already-used');

      if (!isResultPage) {
        stopTimer();
      }
    };
  }, [stopTimer]);

  const handleCancel = () => {
    resetRedemption();
    router.push("/my-packages");
  };

  if (!session || !session.activeCode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-200">
      {/* Header */}
      <Header title="Redeem visit" showBack={true} />

      {/* Content */}
      <div className="flex-1 px-6 pt-12 pb-32 flex items-start justify-center">
        <QRCodeDisplay
          code={session.activeCode.code}
          qrData={session.activeCode.qrData}
          timeRemaining={timeRemaining}
          isExpiring={isCodeExpiring()}
        />
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <button
          onClick={handleCancel}
          className="w-full rounded-full py-4 text-base font-semibold bg-primary-900 text-white border-2 border-neutral-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
