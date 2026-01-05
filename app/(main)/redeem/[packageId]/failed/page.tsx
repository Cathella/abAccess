"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultScreen } from "@/components/common/ResultScreen";
import { useRedemptionStore } from "@/stores/redemptionStore";

export default function RedemptionFailedPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;

  const { session, resetRedemption, generateCode } = useRedemptionStore();

  useEffect(() => {
    // Redirect if no session
    if (!session) {
      router.push("/my-packages");
    }
  }, [session, router]);

  const handleCancel = () => {
    resetRedemption();
    router.push("/my-packages");
  };

  const handleTryAgain = () => {
    generateCode();
    router.push(`/redeem/${packageId}/qr-code`);
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <ResultScreen
      emoji="😔"
      title="Redemption failed"
      subtitle="We couldn't process your redemption. Please try again or contact support if the problem persists."
      primaryAction={{
        label: "Try again",
        onPress: handleTryAgain,
      }}
      secondaryAction={{
        label: "Cancel",
        onPress: handleCancel,
      }}
    />
  );
}
