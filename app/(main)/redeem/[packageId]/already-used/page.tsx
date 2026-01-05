"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultScreen } from "@/components/common/ResultScreen";
import { useRedemptionStore } from "@/stores/redemptionStore";

export default function CodeAlreadyUsedPage() {
  const router = useRouter();
  const { session, resetRedemption } = useRedemptionStore();

  useEffect(() => {
    // Redirect if no session
    if (!session) {
      router.push("/my-packages");
    }
  }, [session, router]);

  const handleBackToPackages = () => {
    resetRedemption();
    router.push("/my-packages");
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
      emoji="❌"
      title="Code already used"
      subtitle="This redemption code has already been used. Please check your visit history or contact support if you believe this is an error."
      primaryAction={{
        label: "Back to packages",
        onPress: handleBackToPackages,
      }}
    />
  );
}
