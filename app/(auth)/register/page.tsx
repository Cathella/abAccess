"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/common/AuthHeader";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Checkbox } from "@/components/ui/checkbox";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SafeArea } from "@/components/common/SafeArea";
import { StepIndicator } from "@/components/common/StepIndicator";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { useRegistrationStore } from "@/stores/registrationStore";
import { checkUserExists } from "@/lib/supabase/auth";
import { ROUTES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const { setPhone, setCurrentStep } = useRegistrationStore();

  // Validate phone number (E.164 format with correct length)
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

    // Validate phone number
    if (!isValidPhone(phoneNumber)) {
      setError("Please enter a valid Ugandan phone number");
      return;
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    setIsChecking(true);

    try {
      // Check if user already exists
      const result = await checkUserExists(phoneNumber);

      if (result.error) {
        console.error("checkUserExists returned error:", result.error);
        setError("Unable to connect to the server. Please check your internet connection and try again.");
        setIsChecking(false);
        return;
      }

      if (result.exists) {
        // User already registered
        setError("This number is already registered. Please sign in.");
        setIsChecking(false);
        return;
      }

      // User doesn't exist - continue to next step
      setPhone(phoneNumber);
      setCurrentStep(2);
      router.push(ROUTES.REGISTER_INFO);
    } catch (err) {
      console.error("Exception in handleContinue:", err);
      setError("Unable to connect to the server. Please check your internet connection and try again.");
      setIsChecking(false);
    }
  };

  const isButtonDisabled = !isValidPhone(phoneNumber) || !termsAccepted || isChecking;

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <AuthHeader backTo={ROUTES.WELCOME} />

        {/* Main content */}
        <div className="flex-1 px-6">
          {/* Title */}
          <h1 className="mb-2 mt-8 text-2xl font-bold text-neutral-900">
            Create an account
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-base text-neutral-600 leading-[160%]">
            Enter your mobile number to get started. We&apos;ll send you a verification code.
          </p>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-base text-neutral-900"
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

          {/* Terms Checkbox */}
          <div className="mt-4 flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              className="mt-0.5 h-5 w-5 rounded border-neutral-400 data-[state=checked]:border-primary-900 data-[state=checked]:bg-primary-900"
            />
            <label
              htmlFor="terms"
              className="flex-1 cursor-pointer select-none text-base text-neutral-600 leading-[160%]"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-secondary-900 underline font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Open terms modal or navigate to terms page
                  console.log("Terms of Service clicked");
                }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-secondary-900 underline font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Open privacy modal or navigate to privacy page
                  console.log("Privacy Policy clicked");
                }}
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        {/* Bottom section - fixed */}
        <SafeArea inset="bottom" className="space-y-4 px-6 pb-6">
          {/* Step Indicator */}
          <StepIndicator totalSteps={4} currentStep={1} />

          {/* Continue Button */}
          <PrimaryButton
            onClick={handleContinue}
            disabled={isButtonDisabled}
            className={
              isButtonDisabled
                ? "rounded-xl bg-neutral-400 hover:bg-neutral-400"
                : "rounded-xl bg-primary-900 hover:bg-primary-800"
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
