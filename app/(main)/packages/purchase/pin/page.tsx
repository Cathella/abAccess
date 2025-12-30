"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { PinInput } from "@/components/forms/PinInput";
import { Checkbox } from "@/components/ui/checkbox";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { useAuthStore } from "@/stores/authStore";
import { PIN_LENGTH } from "@/lib/constants";

export default function PurchasePinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { selectedPackage } = usePurchaseStore();
  const user = useAuthStore((state) => state.user);

  const maxAttempts = 3;
  const attemptsLeft = maxAttempts - attempts;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePinComplete = async (completedPin: string) => {
    // Check if max attempts reached
    if (attempts >= maxAttempts) {
      setError("Maximum attempts reached. Please try again later.");
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // Validate PIN against stored hash
      // Mock validation for now - in production, this would check against user.pinHash
      const isValidPin = await validatePin(completedPin);

      if (isValidPin) {
        // Success - navigate to processing page
        setTimeout(() => {
          router.push("/packages/purchase/processing");
        }, 300);
      } else {
        // Failed attempt
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin("");

        if (newAttempts < maxAttempts) {
          const remaining = maxAttempts - newAttempts;
          setError(
            `Wrong PIN. ${remaining} ${remaining === 1 ? "attempt" : "attempts"} left`
          );
        } else {
          setError("Maximum attempts reached. Please try again later.");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setPin("");
      console.error("PIN verification error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock PIN validation function
  // In production, this would validate against user.pinHash using bcrypt
  const validatePin = async (enteredPin: string): Promise<boolean> => {
    // For demo purposes, accept "1234" as valid PIN
    // In production: return bcrypt.compare(enteredPin, user?.pinHash || "")
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    return enteredPin === "1234";
  };

  // Redirect if no package selected
  if (!selectedPackage) {
    router.push("/packages");
    return null;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <Header title="Enter PIN" showBack />

        {/* Main content */}
        <div className="flex-1 px-4 pt-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Confirm your purchase
          </h1>

          {/* Subtitle */}
          <p className="text-base text-gray-600 mb-8">
            Enter your {PIN_LENGTH}-digit PIN to pay{" "}
            {formatCurrency(selectedPackage.price)} for {selectedPackage.name}.
          </p>

          {/* PIN Input */}
          <PinInput
            value={pin}
            onChange={setPin}
            onComplete={handlePinComplete}
            length={PIN_LENGTH}
            showPin={showPin}
            disabled={attempts >= maxAttempts || isProcessing}
          />

          {/* Error Message */}
          {error && (
            <p
              className="mt-4 text-center text-sm font-medium"
              style={{ color: "#E44F4F" }}
            >
              {error}
            </p>
          )}

          {/* Show PIN Checkbox */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Checkbox
              id="show-pin"
              checked={showPin}
              onCheckedChange={(checked) => setShowPin(checked === true)}
              disabled={attempts >= maxAttempts || isProcessing}
            />
            <label
              htmlFor="show-pin"
              className={`text-base cursor-pointer select-none ${
                attempts >= maxAttempts || isProcessing
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Show PIN
            </label>
          </div>
        </div>

        {/* Bottom section - Forgot PIN link */}
        <div className="px-4 pb-8">
          <div className="text-center">
            <Link
              href="/forgot-pin"
              className="text-base font-medium"
              style={{ color: "#3A8DFF" }}
            >
              Forgot PIN?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
