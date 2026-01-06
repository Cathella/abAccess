"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-20 pb-10">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center text-center">
        <div className="text-[64px] leading-none">😒</div>

        <h1 className="mt-6 text-2xl font-bold text-neutral-900">
          Code expired
        </h1>

        <p className="mt-4 text-base leading-relaxed text-neutral-600">
          Your redemption code has expired. Generate a new one to continue.
        </p>
      </div>

      <div className="w-full max-w-sm pt-8">
        <button
          onClick={handleCancel}
          className="mb-6 w-full text-center text-base font-semibold text-neutral-900"
        >
          Cancel
        </button>

        <button
          onClick={handleGenerateNewCode}
          className="h-12 w-full rounded-2xl border-2 border-neutral-900 bg-emerald-100 text-base font-semibold text-neutral-900 transition-colors hover:bg-emerald-200"
        >
          Generate new code
        </button>
      </div>
    </div>
  );
}
