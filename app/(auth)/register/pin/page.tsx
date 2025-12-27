"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/common/AuthHeader";
import { PinInput } from "@/components/forms/PinInput";
import { Checkbox } from "@/components/ui/checkbox";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SafeArea } from "@/components/common/SafeArea";
import { StepIndicator } from "@/components/common/StepIndicator";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { useRegistrationStore } from "@/stores/registrationStore";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES, PIN_LENGTH } from "@/lib/constants";

export default function RegisterPinPage() {
  const router = useRouter();
  const { phone, firstName, lastName, nin, setPin, createAccount, clearRegistration } = useRegistrationStore();
  const { signIn } = useAuthStore();

  const [pin, setPinValue] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Redirect if required data is missing (but not if registration is complete)
  useEffect(() => {
    if (registrationComplete) {
      return;
    }

    if (!phone || !firstName || !nin) {
      // Missing required data, redirect to step 1
      router.push(ROUTES.REGISTER);
    }
  }, [phone, firstName, nin, router, registrationComplete]);

  const isPinComplete = pin.length === PIN_LENGTH;

  const handlePinChange = (value: string) => {
    setPinValue(value);
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };

  const handleSetPin = async () => {
    if (!isPinComplete) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    // Validate PIN strength (optional)
    // Check for weak PINs like 1111, 1234, etc.
    const weakPins = ["0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "1234", "4321"];
    if (weakPins.includes(pin)) {
      setError("Please choose a stronger PIN");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Store PIN in registration store
      setPin(pin);

      // Call createAccount from registration store
      const result = await createAccount();

      if (!result.success) {
        setError(result.error || "Failed to create account. Please try again.");
        setIsCreating(false);
        return;
      }

      // Registration successful - auto login
      if (result.user && result.session) {
        // Update auth store with new user and session
        signIn(result.user, result.session);

        // Set session cookie via API route - AWAIT this before navigating
        try {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session: result.session,
              user: result.user,
            }),
          });
        } catch (cookieError) {
          console.error('Failed to set session cookie:', cookieError);
          // Continue anyway - client-side auth still works
        }

        // Mark registration as complete to prevent redirect loop
        setRegistrationComplete(true);

        // Clear registration data after successful creation
        clearRegistration();

        // Navigate to success page - using replace to prevent back navigation
        router.replace(ROUTES.REGISTER_SUCCESS);
      } else {
        setError("Registration succeeded but login failed. Please sign in.");
        setIsCreating(false);
      }
    } catch (err) {
      console.error("Account creation error:", err);
      setError("Failed to create account. Please try again.");
      setIsCreating(false);
    }
  };

  const handleGoBack = () => {
    router.push(ROUTES.REGISTER_INFO);
  };

  if (!phone || !firstName || !nin) {
    return null; // Will redirect
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <AuthHeader backTo={ROUTES.REGISTER_INFO} />

        {/* Main content */}
        <div className="flex-1 px-6">
          {/* Title */}
          <h1 className="mb-2 mt-8 text-2xl font-bold text-neutral-900">
            Create your PIN
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-base text-neutral-600 leading-[160%]">
            Choose a 4-digit PIN to secure your wallet and health data. You&apos;ll use this to approve transactions.
          </p>

          {/* PIN Input */}
          <PinInput
            value={pin}
            onChange={handlePinChange}
            length={PIN_LENGTH}
            showPin={showPin}
            disabled={isCreating}
            error={error || undefined}
          />

          {/* Show PIN Checkbox */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Checkbox
              id="show-pin"
              checked={showPin}
              onCheckedChange={(checked) => setShowPin(checked === true)}
              disabled={isCreating}
              className="h-5 w-5 rounded border-neutral-400 data-[state=checked]:bg-primary-900 data-[state=checked]:border-primary-900"
            />
            <label
              htmlFor="show-pin"
              className={`text-sm cursor-pointer select-none ${isCreating ? 'text-neutral-400' : 'text-neutral-600'}`}
            >
              Show PIN
            </label>
          </div>
        </div>

        {/* Bottom section - fixed */}
        <SafeArea inset="bottom" className="space-y-4 px-6 pb-6">
          {/* Step Indicator */}
          <StepIndicator totalSteps={4} currentStep={4} />

          {/* Go Back Link */}
          <div className="text-center">
            <button
              onClick={handleGoBack}
              disabled={isCreating}
              className="text-sm font-semibold text-neutral-900 hover:underline disabled:opacity-50"
            >
              Go Back
            </button>
          </div>

          {/* Set PIN Button */}
          <PrimaryButton
            onClick={handleSetPin}
            disabled={!isPinComplete || isCreating}
            className={
              !isPinComplete || isCreating
                ? "rounded-xl bg-neutral-400 hover:bg-neutral-400"
                : "rounded-xl bg-primary-900 hover:bg-primary-800"
            }
          >
            Set PIN
          </PrimaryButton>
        </SafeArea>
      </div>

      {/* Loading Overlay - shown while creating account */}
      {isCreating && <LoadingOverlay text="Creating your account..." />}
    </>
  );
}
