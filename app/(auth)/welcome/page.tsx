import type { Metadata } from "next";
import Image from "next/image";
import { SafeArea } from "@/components/common/SafeArea";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Welcome - ABA Access",
  description: "Affordable healthcare for your family",
};

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Main content - centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/logos/logo-text.svg"
            alt="abAccess"
            width={200}
            height={80}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <h1 className="mb-3 text-xl font-semibold text-neutral-900 leading-8">
          Affordable healthcare for your family
        </h1>

        {/* Description */}
        <p className="text-base text-neutral-700 mb-6">
          Save on visits to 45+ partner facilities with prepaid healthcare packages.
        </p>
      </div>

      {/* Action buttons - fixed at bottom */}
      <SafeArea inset="bottom" className="space-y-2 mb-6">
        {/* Create Account Button */}
        <SecondaryButton href={ROUTES.REGISTER}>
          Create Account
        </SecondaryButton>

        {/* Login Button */}
        <PrimaryButton href={ROUTES.SIGN_IN}>Login</PrimaryButton>
      </SafeArea>
    </div>
  );
}
