"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/common/AuthHeader";
import { SafeArea } from "@/components/common/SafeArea";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { useAuthStore } from "@/stores/authStore";
import { checkUserExists } from "@/lib/supabase/auth";
import { ROUTES } from "@/lib/constants";

export default function SignInPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { setPhoneNumber: setStorePhoneNumber } = useAuthStore();

  // Validate phone number
  const isValidPhone = (phone: string): boolean => {
    if (!phone) return false;
    const digits = phone.replace(/\D/g, "");

    // Check if it's E.164 format with correct length
    if (!phone.startsWith("+256")) return false;
    if (digits.length !== 12) return false; // 256 + 9 digits

    // Check if starts with valid prefix (70, 74, 75, 76, 77, 78)
    const prefix = digits.substring(3, 5);
    return ["70", "74", "75", "76", "77", "78"].includes(prefix);
  };

  const handleContinue = async () => {
    setError(null);

    if (!isValidPhone(phoneNumber)) {
      setError("Please enter a valid Ugandan phone number");
      return;
    }

    setIsChecking(true);

    try {
      // Check if user exists
      const result = await checkUserExists(phoneNumber);

      if (result.error) {
        console.error("checkUserExists returned error:", result.error);
        setError("Unable to connect to the server. Please check your internet connection and try again.");
        setIsChecking(false);
        return;
      }

      if (result.exists) {
        // User exists - store phone and go to PIN entry
        setStorePhoneNumber(phoneNumber);
        router.push(ROUTES.ENTER_PIN);
      } else {
        // User not found - friendly message
        setError("We couldn't find an account with this phone number. Please check the number or create a new account.");
        setIsChecking(false);
      }
    } catch (err) {
      console.error("Exception in handleContinue:", err);
      setError("Unable to connect to the server. Please check your internet connection and try again.");
      setIsChecking(false);
    }
  };

  const isButtonDisabled = !isValidPhone(phoneNumber) || isChecking;

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <AuthHeader backTo={ROUTES.WELCOME} />

        {/* Main content */}
        <div className="flex-1 px-6">
          {/* Title */}
          <h1 className="mb-2 mt-8 text-2xl font-bold text-neutral-900">
            Welcome back!
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-base text-neutral-600">
            Enter your phone number to sign in.
          </p>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-base font-medium text-neutral-900"
            >
              Mobile number
            </label>
            <PhoneInput
              id="phone"
              value={phoneNumber}
              onChange={setPhoneNumber}
              label=""
              error={error || undefined}
            />
          </div>
        </div>

        {/* Bottom section - fixed */}
        <SafeArea inset="bottom" className="space-y-4 px-6 pb-6">
          {/* Create account link */}
          <div className="text-center">
            <span className="text-sm text-neutral-600">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href={ROUTES.ONBOARDING}
              className="text-sm text-secondary-900 underline"
            >
              Create one
            </Link>
          </div>

          {/* Continue Button */}
          <PrimaryButton
            onClick={handleContinue}
            disabled={isButtonDisabled}
            className={
              isButtonDisabled
                ? "h-12 rounded-xl bg-neutral-400 hover:bg-neutral-400"
                : "h-12 rounded-xl bg-primary-900 hover:bg-primary-800"
            }
          >
            Continue
          </PrimaryButton>
        </SafeArea>
      </div>

      {/* Loading Overlay - shown while checking user */}
      {isChecking && <LoadingOverlay text="Checking account..." />}
    </>
  );
}
