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
        phoneDigits = "0" + digits.substring(3);
      }

      // Limit to 10 digits (0 + 9 digits)
      phoneDigits = phoneDigits.substring(0, 10);

      // Format as: 07XX XXX XXX
      if (phoneDigits.length === 0) return "";

      let formatted = "";
      if (phoneDigits.length > 0) {
        formatted += phoneDigits.substring(0, 4);
      }
      if (phoneDigits.length > 4) {
        formatted += " " + phoneDigits.substring(4, 7);
      }
      if (phoneDigits.length > 7) {
        formatted += " " + phoneDigits.substring(7, 10);
      }

      return formatted;
    };

    // Convert formatted number to E.164 format (+256XXXXXXXXX)
    const toE164 = (value: string): string => {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 0) return "";

      // If it already has country code
      if (digits.startsWith("256")) {
        return "+" + digits;
      }

      // Remove leading 0 if present
      let phoneDigits = digits;
      if (phoneDigits.startsWith("0")) {
        phoneDigits = phoneDigits.substring(1);
      }

      return "+256" + phoneDigits;
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

      if (digits.length !== 10) return false;

      // Validate it starts with 0 and has valid prefix
      if (!digits.startsWith("0")) return false;

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
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          placeholder="07XX XXX XXX"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            "h-12 rounded-lg border-[1.5px] border-neutral-300 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0",
            error && "border-destructive focus-visible:border-destructive",
            !isValid && displayValue && "border-warning-900",
            className
          )}
          {...props}
        />
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
