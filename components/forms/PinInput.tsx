"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PinInputProps {
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (pin: string) => void;
  length?: number;
  showPin?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  (
    {
      error,
      value = "",
      onChange,
      onComplete,
      length = 4,
      showPin = false,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [pins, setPins] = React.useState<string[]>(
      Array(length).fill("")
    );
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Auto-focus first input on mount
    React.useEffect(() => {
      inputRefs.current[0]?.focus();
    }, []);

    // Sync external value with internal state
    React.useEffect(() => {
      if (value !== undefined) {
        const pinArray = value.split("").slice(0, length);
        const paddedArray = [...pinArray, ...Array(length - pinArray.length).fill("")];
        setPins(paddedArray);
      }
    }, [value, length]);

    const handleChange = (index: number, digit: string) => {
      // Only allow digits
      const numericValue = digit.replace(/\D/g, "");

      if (numericValue.length > 1) {
        // Handle paste
        const pastedDigits = numericValue.split("").slice(0, length);
        const newPins = [...pins];

        pastedDigits.forEach((d, i) => {
          if (index + i < length) {
            newPins[index + i] = d;
          }
        });

        setPins(newPins);
        const combinedPin = newPins.join("");
        onChange?.(combinedPin);

        // Focus last filled input or next empty
        const nextIndex = Math.min(index + pastedDigits.length, length - 1);
        inputRefs.current[nextIndex]?.focus();

        // Check if complete
        if (newPins.every((p) => p !== "")) {
          onComplete?.(combinedPin);
        }
      } else {
        // Single digit input
        const newPins = [...pins];
        newPins[index] = numericValue;
        setPins(newPins);

        const combinedPin = newPins.join("");
        onChange?.(combinedPin);

        // Auto-focus next input
        if (numericValue && index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newPins.every((p) => p !== "")) {
          onComplete?.(combinedPin);
        }
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newPins = [...pins];

        if (pins[index]) {
          // Clear current input
          newPins[index] = "";
          setPins(newPins);
          onChange?.(newPins.join(""));
        } else if (index > 0) {
          // Move to previous input and clear it
          newPins[index - 1] = "";
          setPins(newPins);
          onChange?.(newPins.join(""));
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    return (
      <div className={cn(className)}>
        {/* PIN Inputs */}
        <div className="flex gap-1">
          {pins.map((pin, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
                // Expose first input to parent ref
                if (index === 0 && ref) {
                  if (typeof ref === "function") {
                    ref(el);
                  } else {
                    ref.current = el;
                  }
                }
              }}
              type={showPin ? "tel" : "password"}
              inputMode="numeric"
              maxLength={1}
              value={pin}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={handleFocus}
              disabled={disabled}
              className={cn(
                "h-16 flex-1 rounded-xl border-[1.5px] border-neutral-400 text-center text-2xl font-bold tabular-nums",
                "focus-visible:border-2 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0",
                error && "border-destructive focus-visible:border-destructive",
                disabled && "cursor-not-allowed opacity-50"
              )}
              aria-label={`PIN digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-sm text-destructive text-center">{error}</p>
        )}
      </div>
    );
  }
);

PinInput.displayName = "PinInput";

// Validation helper for react-hook-form
export const validatePin = (length: number = 4) => (value: string): boolean | string => {
  if (!value) return "PIN is required";
  if (value.length !== length) return `PIN must be ${length} digits`;
  if (!/^\d+$/.test(value)) return "PIN must contain only numbers";
  return true;
};
