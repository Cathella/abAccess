"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

// Valid Uganda prefixes: MTN (077, 078, 076) and Airtel (070, 075, 074)
const VALID_PREFIXES = ['077', '078', '076', '070', '075', '074'];

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label = "Phone Number", error, onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");

    // Format phone number as user types
    const formatPhoneNumber = (value: string): string => {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, "");

      // Remove country code if present
      let phoneDigits = digits;
      if (digits.startsWith("256")) {
        phoneDigits = digits.substring(3);
      }

      // Limit to 9 digits (Uganda mobile numbers are 9 digits after country code)
      phoneDigits = phoneDigits.substring(0, 9);

      // Format as: 0XX XXX XXX
      if (phoneDigits.length === 0) return "";

      let formatted = "0";
      if (phoneDigits.length > 0) {
        formatted += phoneDigits.substring(0, 2);
      }
      if (phoneDigits.length > 2) {
        formatted += " " + phoneDigits.substring(2, 5);
      }
      if (phoneDigits.length > 5) {
        formatted += " " + phoneDigits.substring(5, 9);
      }

      return formatted;
    };

    // Convert formatted number to E.164 format (+256XXXXXXXXX)
    const toE164 = (value: string): string => {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 0) return "";

      // If it starts with 0, replace with 256
      if (digits.startsWith("0")) {
        return "+256" + digits.substring(1);
      }

      // If it already has country code
      if (digits.startsWith("256")) {
        return "+" + digits;
      }

      return "+256" + digits;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = formatPhoneNumber(inputValue);
      setDisplayValue(formatted);

      // Pass E.164 format to onChange
      if (onChange) {
        const e164 = toE164(formatted);
        onChange(e164);
      }
    };

    // Validate phone number
    const isValid = React.useMemo(() => {
      if (!displayValue) return true; // Empty is valid (let required handle it)
      const digits = displayValue.replace(/\D/g, "");

      if (digits.length !== 9) return false;

      const prefix = digits.substring(0, 3);
      return VALID_PREFIXES.includes(prefix);
    }, [displayValue]);

    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={props.id}
            className={cn(error && "text-destructive")}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-600 pointer-events-none">
            +256
          </div>
          <Input
            ref={ref}
            type="tel"
            inputMode="numeric"
            placeholder="0XX XXX XXX"
            value={displayValue}
            onChange={handleChange}
            className={cn(
              "pl-16 min-h-[44px] text-base",
              error && "border-destructive focus-visible:ring-destructive",
              !isValid && displayValue && "border-warning-900",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {!error && !isValid && displayValue && (
          <p className="text-sm text-warning-900">
            Please enter a valid MTN or Airtel number
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

// Validation helper for react-hook-form
export const validateUgandaPhone = (value: string): boolean | string => {
  if (!value) return "Phone number is required";

  const digits = value.replace(/\D/g, "");
  let phoneDigits = digits;

  // Remove country code if present
  if (digits.startsWith("256")) {
    phoneDigits = digits.substring(3);
  }

  if (phoneDigits.length !== 9) {
    return "Phone number must be 9 digits";
  }

  const prefix = phoneDigits.substring(0, 3);
  if (!VALID_PREFIXES.includes(prefix)) {
    return "Please enter a valid MTN (077, 078, 076) or Airtel (070, 075, 074) number";
  }

  return true;
};
