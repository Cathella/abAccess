"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultScreen } from "@/components/common/ResultScreen";
import { useRedemptionStore } from "@/stores/redemptionStore";

export default function CodeExpiredPage() {
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

  const handleGenerateNewCode = () => {
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
      emoji="⏰"
      title="Code expired"
      subtitle="Your redemption code has expired. Generate a new one to continue."
      primaryAction={{
        label: "Generate new code",
        onPress: handleGenerateNewCode,
      }}
      secondaryAction={{
        label: "Cancel",
        onPress: handleCancel,
      }}
    />
  );
}
