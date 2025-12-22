"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/common/AuthHeader";
import { SafeArea } from "@/components/common/SafeArea";
import { PinInput } from "@/components/forms/PinInput";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Checkbox } from "@/components/ui/checkbox";
import { verifyPhoneAndPin } from "@/lib/supabase/auth";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES, PIN_LENGTH } from "@/lib/constants";

export default function EnterPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { phoneNumber, signIn } = useAuthStore();

  // Redirect if no phone number
  useEffect(() => {
    if (!phoneNumber) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [phoneNumber, router]);

  const handlePinComplete = async (completedPin: string) => {
    if (!phoneNumber) return;

    setError(null);
    setIsVerifying(true);

    try {
      const result = await verifyPhoneAndPin(phoneNumber, completedPin);

      if (result.success && result.session && result.user) {
        // Sign in the user
        signIn(result.user, result.session);

        // Show loading screen briefly before redirect
        setTimeout(() => {
          router.push(ROUTES.DASHBOARD);
        }, 500);
      } else {
        setError(result.error || "Invalid phone number or PIN");
        setPin("");
        setIsVerifying(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setPin("");
      setIsVerifying(false);
      console.error("PIN verification error:", err);
    }
  };

  if (isVerifying) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <AuthHeader backTo={ROUTES.SIGN_IN} />

      {/* Main content */}
      <div className="flex-1 px-6">
        {/* Title */}
        <h1 className="mb-2 mt-8 text-2xl font-bold text-neutral-900">
          Enter your PIN
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-base text-neutral-600">
          Enter your {PIN_LENGTH}-digit PIN to access your account.
        </p>

        {/* PIN Input */}
        <PinInput
          value={pin}
          onChange={setPin}
          onComplete={handlePinComplete}
          length={PIN_LENGTH}
          showPin={showPin}
          error={error || undefined}
        />

        {/* Show PIN Checkbox */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <Checkbox
            id="show-pin"
            checked={showPin}
            onCheckedChange={(checked) => setShowPin(checked === true)}
            className="h-5 w-5 rounded border-neutral-400 data-[state=checked]:bg-primary-900 data-[state=checked]:border-primary-900"
          />
          <label
            htmlFor="show-pin"
            className="text-sm text-neutral-600 cursor-pointer select-none"
          >
            Show PIN
          </label>
        </div>
      </div>

      {/* Bottom section - fixed */}
      <SafeArea inset="bottom" className="px-6 pb-6">
        {/* Forgot PIN link */}
        <div className="text-center">
          <Link
            href="/forgot-pin"
            className="text-sm text-secondary-900 underline"
          >
            Forgot PIN?
          </Link>
        </div>
      </SafeArea>
    </div>
  );
}
