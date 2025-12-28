"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SafeArea } from "@/components/common/SafeArea";
import { ROUTES } from "@/lib/constants";

export default function AddDependentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const childName = searchParams.get("name") || "Your child";
  const gender = searchParams.get("gender") || "male";

  // Select emoji based on gender
  const childEmoji = gender === "female" ? "👧" : "👦";

  const handleContinue = () => {
    // Navigate back to family page
    router.push(ROUTES.FAMILY);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Main content - centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Child Avatar/Emoji */}
        <div className="mb-6 text-[64px] leading-none" role="img" aria-label="child">
          {childEmoji}
        </div>

        {/* Title */}
        <h1 className="mb-3 text-xl font-bold text-neutral-900">
          {childName} has been added!
        </h1>

        {/* Description */}
        <p className="text-base text-neutral-600 leading-[160%]">
          You can now book visits and use your bundles for {childName}.
        </p>
      </div>

      {/* Bottom section - fixed */}
      <SafeArea inset="bottom" className="px-6 pb-6">
        <PrimaryButton
          onClick={handleContinue}
          className="h-14 rounded-2xl bg-primary-900 hover:bg-primary-800"
        >
          Done
        </PrimaryButton>
      </SafeArea>
    </div>
  );
}
