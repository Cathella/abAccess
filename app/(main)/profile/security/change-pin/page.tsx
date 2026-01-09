"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { PinInput } from "@/components/forms/PinInput";
import { cn } from "@/lib/utils";

type Step = "verify" | "create" | "confirm" | "success";

export default function ChangePinPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("verify");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // For demo: simulated current PIN (in production, verify against backend)
  const DEMO_CURRENT_PIN = "1234";

  const handleVerifyPin = useCallback(
    async (pin: string) => {
      setIsProcessing(true);
      setError("");

      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (pin === DEMO_CURRENT_PIN) {
        setCurrentPin(pin);
        setStep("create");
      } else {
        setError("Incorrect PIN. Please try again.");
      }
      setIsProcessing(false);
    },
    [DEMO_CURRENT_PIN]
  );

  const handleCreatePin = useCallback((pin: string) => {
    // Check for weak PINs
    const weakPins = ["0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "1234", "4321"];
    if (weakPins.includes(pin)) {
      setError("Please choose a stronger PIN. Avoid simple patterns.");
      return;
    }

    setNewPin(pin);
    setError("");
    setStep("confirm");
  }, []);

  const handleConfirmPin = useCallback(
    async (pin: string) => {
      if (pin !== newPin) {
        setError("PINs don't match. Please try again.");
        setConfirmPin("");
        return;
      }

      setIsProcessing(true);
      setError("");

      // Simulate API call to save new PIN
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production: await updatePin(currentPin, newPin);
      setStep("success");
      setIsProcessing(false);
    },
    [newPin]
  );

  const handleBack = () => {
    if (step === "verify" || step === "success") {
      router.back();
    } else if (step === "create") {
      setStep("verify");
      setCurrentPin("");
      setError("");
    } else if (step === "confirm") {
      setStep("create");
      setNewPin("");
      setConfirmPin("");
      setError("");
    }
  };

  const handleDone = () => {
    router.push("/profile/security");
  };

  const getStepContent = () => {
    switch (step) {
      case "verify":
        return {
          title: "Enter your current PIN",
          subtitle: "We need to verify it's you",
        };
      case "create":
        return {
          title: "Create a new PIN",
          subtitle: "Choose a 4-digit PIN you'll remember",
        };
      case "confirm":
        return {
          title: "Confirm your new PIN",
          subtitle: "Re-enter your new PIN",
        };
      case "success":
        return {
          title: "PIN updated!",
          subtitle: "Your PIN has been changed successfully",
        };
    }
  };

  const content = getStepContent();

  return (
    <div className="min-h-screen bg-neutral-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-300 px-4">
        <div className="flex h-14 items-center gap-3">
          {step !== "success" && (
            <button
              onClick={handleBack}
              className="p-1 -ml-1"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className="text-neutral-900" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-neutral-900">Change PIN</h1>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Success State */}
        {step === "success" ? (
          <div className="flex flex-col items-center text-center pt-12">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6">
              <Check size={40} className="text-primary-900" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {content.title}
            </h2>

            {/* Subtitle */}
            <p className="text-base text-neutral-600 mb-8">{content.subtitle}</p>

            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full h-12 bg-primary-900 text-white font-semibold rounded-xl hover:bg-primary-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {["verify", "create", "confirm"].map((s, index) => (
                <div
                  key={s}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    step === s
                      ? "bg-primary-900"
                      : index <
                        ["verify", "create", "confirm"].indexOf(step)
                      ? "bg-primary-900"
                      : "bg-neutral-400"
                  )}
                />
              ))}
            </div>

            {/* Title Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {content.title}
              </h2>
              <p className="text-base text-neutral-600">{content.subtitle}</p>
            </div>

            {/* PIN Input */}
            <div className="max-w-xs mx-auto">
              {step === "verify" && (
                <PinInput
                  key="verify-pin"
                  value={currentPin}
                  onChange={setCurrentPin}
                  onComplete={handleVerifyPin}
                  error={error}
                  disabled={isProcessing}
                />
              )}

              {step === "create" && (
                <PinInput
                  key="create-pin"
                  value={newPin}
                  onChange={setNewPin}
                  onComplete={handleCreatePin}
                  error={error}
                  disabled={isProcessing}
                />
              )}

              {step === "confirm" && (
                <PinInput
                  key="confirm-pin"
                  value={confirmPin}
                  onChange={setConfirmPin}
                  onComplete={handleConfirmPin}
                  error={error}
                  disabled={isProcessing}
                />
              )}
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
              <p className="text-center text-sm text-neutral-600 mt-4">
                {step === "verify" ? "Verifying..." : "Saving..."}
              </p>
            )}

            {/* Help Text */}
            {step === "verify" && !error && (
              <p className="text-center text-sm text-neutral-500 mt-8">
                Forgot your PIN?{" "}
                <button
                  onClick={() => router.push("/profile/security/forgot-pin")}
                  className="text-secondary-900 font-medium"
                >
                  Reset it here
                </button>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
