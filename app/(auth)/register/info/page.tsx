"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/common/AuthHeader";
import { TextInput } from "@/components/forms/TextInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SafeArea } from "@/components/common/SafeArea";
import { StepIndicator } from "@/components/common/StepIndicator";
import { useRegistrationStore } from "@/stores/registrationStore";
import { validateNIN, validateFullName, formatNIN, splitFullName } from "@/lib/validation";
import { ROUTES } from "@/lib/constants";

export default function RegisterInfoPage() {
  const router = useRouter();
  const { phone, setName, setNin, setCurrentStep } = useRegistrationStore();

  const [fullName, setFullName] = useState("");
  const [nin, setNinValue] = useState("");
  const [errors, setErrors] = useState<{ name?: string; nin?: string }>({});

  // Redirect if no phone (must complete step 1 first)
  useEffect(() => {
    if (!phone) {
      router.push(ROUTES.REGISTER);
    }
  }, [phone, router]);

  // Validate full name
  const isNameValid = validateFullName(fullName);

  // Validate NIN
  const isNinValid = validateNIN(nin);

  // Form is valid when both fields are valid
  const isFormValid = isNameValid && isNinValid;

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    // Clear error when user types
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleNinChange = (value: string) => {
    // Auto-uppercase and limit to 14 characters
    const formatted = formatNIN(value).substring(0, 14);
    setNinValue(formatted);
    // Clear error when user types
    if (errors.nin) {
      setErrors((prev) => ({ ...prev, nin: undefined }));
    }
  };

  const handleContinue = () => {
    // Validate before proceeding
    const newErrors: { name?: string; nin?: string } = {};

    if (!isNameValid) {
      newErrors.name = "Please enter your full name (first and last name)";
    }

    if (!isNinValid) {
      newErrors.nin = "Please enter a valid 14-character NIN (e.g., CM92018100J4GKL)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Split name into first and last
    const { firstName, lastName } = splitFullName(fullName);

    // Store in registration store
    setName(firstName, lastName);
    setNin(nin);
    setCurrentStep(3);

    // Navigate to step 3 (NIN verification or PIN creation)
    // For now, skip NIN verification and go to PIN
    router.push(ROUTES.REGISTER_PIN);
  };

  if (!phone) {
    return null; // Will redirect
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <AuthHeader backTo={ROUTES.REGISTER} />

        {/* Main content */}
        <div className="flex-1 px-6">
          {/* Title */}
          <h1 className="mb-2 mt-8 text-2xl font-bold text-neutral-900">
            Tell us about yourself
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-base text-neutral-600 leading-[160%]">
            We&apos;ll use this to personalize your experience and verify your identity
          </p>

          {/* Full Name Input */}
          <div className="mb-6">
            <TextInput
              id="fullName"
              label="Full name"
              value={fullName}
              onChange={handleFullNameChange}
              placeholder="Catherine Nakitto"
              error={errors.name}
              autoComplete="name"
              autoFocus
            />
          </div>

          {/* NIN Input */}
          <div>
            <TextInput
              id="nin"
              label="National ID Number (NIN)"
              value={nin}
              onChange={handleNinChange}
              placeholder="CM92018100J4GKL"
              error={errors.nin}
              helperText="Your NIN is printed on your national ID card"
              maxLength={14}
              className="uppercase"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Bottom section - fixed */}
        <SafeArea inset="bottom" className="space-y-4 px-6 pb-6">
          {/* Step Indicator */}
          <StepIndicator totalSteps={4} currentStep={2} />

          {/* Go Back Link */}
          <div className="text-center">
            <button
              onClick={() => router.push(ROUTES.REGISTER)}
              className="text-sm font-semibold text-neutral-900 hover:underline"
            >
              Go Back
            </button>
          </div>

          {/* Continue Button */}
          <PrimaryButton
            onClick={handleContinue}
            disabled={!isFormValid}
            className={
              !isFormValid
                ? "rounded-xl bg-neutral-400 hover:bg-neutral-400"
                : "rounded-xl bg-primary-900 hover:bg-primary-800"
            }
          >
            Save &amp; Continue
          </PrimaryButton>
        </SafeArea>
      </div>
    </>
  );
}
