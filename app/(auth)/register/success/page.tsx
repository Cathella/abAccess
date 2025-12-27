"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SafeArea } from "@/components/common/SafeArea";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants";

export default function RegisterSuccessPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.push(ROUTES.WELCOME);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  const handleContinue = () => {
    // Use replace to prevent back navigation to registration flow
    router.replace(ROUTES.DASHBOARD);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  // Get Member ID from user data (stored in database during registration)
  const memberId = user.memberId || "N/A";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Main content - centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Celebration Icon */}
        <div className="mb-4 text-[64px] leading-none" role="img" aria-label="celebration">
          🎉
        </div>

        {/* Title */}
        <h1 className="mb-3 text-xl font-bold text-neutral-900">
          You&apos;re all set, {user.firstName}!
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-[320px] text-base text-neutral-600 leading-[160%]">
          Welcome to abAccess. Your Member ID is below - you can also find it anytime in your profile
        </p>

        {/* Member ID Card */}
        <div className="w-full rounded-2xl bg-secondary-900 px-6 py-8 text-center">
          <p className="mb-2 text-sm text-white opacity-80">
            Your Member ID:
          </p>
          <p className="text-4xl font-bold text-white tracking-[2px]">
            {memberId}
          </p>
        </div>
      </div>

      {/* Bottom section - fixed */}
      <SafeArea inset="bottom" className="px-6 pb-6">
        <PrimaryButton
          onClick={handleContinue}
          className="rounded-xl bg-primary-900 hover:bg-primary-800"
        >
          Go to dashboard
        </PrimaryButton>
      </SafeArea>
    </div>
  );
}
