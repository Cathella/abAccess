"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

  const packageCategory = session.package?.package?.category;
  const visitCount = session.package?.package?.visitCount;

  const formatCategory = (category?: string) => {
    if (!category) return "Package";
    return category
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-20 pb-10">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center text-center">
        <div className="text-[64px] leading-none">😔</div>

        <h1 className="mt-6 text-xl font-bold text-neutral-900">
          Redemption failed
        </h1>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          The facility couldn&apos;t process your visit. Please speak with the receptionist.
        </p>

        <div className="mt-8 w-full rounded-4xl border border-neutral-400 bg-white px-6 py-5">
          <div className="text-lg font-semibold text-neutral-900">
            {formatCategory(packageCategory)}
          </div>
          <div className="mt-1 text-base text-neutral-700">
            {visitCount ? `${visitCount} Visits Pack` : "Visits Pack"}
          </div>
        </div>

        <p className="mt-8 text-base text-neutral-700">
          No visit was deducted from your package
        </p>
      </div>

      <div className="w-full max-w-sm pt-6">
        <button
          onClick={handleCancel}
          className="mb-6 w-full text-center text-base font-semibold text-neutral-900"
        >
          Back to my packages
        </button>

        <button
          onClick={handleTryAgain}
          className="h-12 w-full rounded-xl border-2 border-neutral-900 bg-primary-900 text-base font-bold text-neutral-900 transition-colors hover:bg-emerald-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
