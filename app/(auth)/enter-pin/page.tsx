"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/common/AuthHeader";
import { SafeArea } from "@/components/common/SafeArea";
import { PinInput } from "@/components/forms/PinInput";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, PIN_LENGTH } from "@/lib/constants";

export default function EnterPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    phoneNumber,
    isPinLocked,
    pinAttempts,
    login,
    isLoading,
  } = useAuth();

  const maxAttempts = 3;
  const attemptsLeft = maxAttempts - pinAttempts;

  // Redirect if no phone number
  useEffect(() => {
    if (!phoneNumber) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [phoneNumber, router]);

  const handlePinComplete = async (completedPin: string) => {
    if (!phoneNumber) return;

    // Check if locked
    if (isPinLocked) {
      setError("Account locked after 3 failed attempts. Please use Forgot PIN.");
      return;
    }

    setError(null);

    try {
      const result = await login(phoneNumber, completedPin);

      if (result.success) {
        // Success - useAuth already updated store
        // Show loading briefly before redirect
        setTimeout(() => {
          router.push(ROUTES.DASHBOARD);
        }, 500);
      } else {
        // Failed - useAuth already incremented attempts
        setPin("");

        // Build error message with attempts remaining
        const newAttempts = pinAttempts + 1;
        if (newAttempts < maxAttempts) {
          const remaining = maxAttempts - newAttempts;
          setError(`${result.error || "Wrong PIN"}. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`);
        } else {
          setError(result.error || "Wrong PIN");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setPin("");
      console.error("PIN verification error:", err);
    }
  };

  return (
    <>
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

          {/* Lock Warning */}
          {isPinLocked && (
            <div className="mb-4 rounded-lg bg-error-100 border border-error-900 p-4">
              <p className="text-sm font-semibold text-error-900">
                Account Locked
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                Your account has been locked after 3 failed attempts.
              </p>
            </div>
          )}

          {/* Attempts Warning */}
          {!isPinLocked && pinAttempts > 0 && (
            <div className="mb-4 rounded-lg bg-warning-100 border border-warning-900 p-4">
              <p className="text-sm font-semibold text-warning-900">
                {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
              </p>
            </div>
          )}

          {/* PIN Input */}
          <PinInput
            value={pin}
            onChange={setPin}
            onComplete={handlePinComplete}
            length={PIN_LENGTH}
            showPin={showPin}
            disabled={isPinLocked}
          />

          {/* Error Message - shown between PIN input and checkbox */}
          {error && (
            <p className="mt-4 text-center text-sm text-error-900">
              {error}
            </p>
          )}

          {/* Show PIN Checkbox */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Checkbox
              id="show-pin"
              checked={showPin}
              onCheckedChange={(checked) => setShowPin(checked === true)}
              disabled={isPinLocked}
              className="h-5 w-5 rounded border-neutral-400 data-[state=checked]:bg-primary-900 data-[state=checked]:border-primary-900"
            />
            <label
              htmlFor="show-pin"
              className={`text-sm cursor-pointer select-none ${isPinLocked ? 'text-neutral-400' : 'text-neutral-600'}`}
            >
              Show PIN
            </label>
          </div>
        </div>

        {/* Bottom section - fixed */}
        <SafeArea inset="bottom" className="px-6 pb-6">
          {/* Forgot PIN link - only show when locked */}
          {isPinLocked && (
            <div className="text-center">
              <Link
                href={ROUTES.FORGOT_PIN}
                className="text-sm text-secondary-900 underline"
              >
                Forgot PIN?
              </Link>
            </div>
          )}
        </SafeArea>
      </div>

      {/* Loading Overlay - shown during PIN verification */}
      {isLoading && <LoadingOverlay text="Signing in..." />}
    </>
  );
}
