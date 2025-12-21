"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}

export function PhoneInput({ value, onChange, label = "Phone Number" }: PhoneInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="tel"
          id="phone"
          placeholder="+256 700 000 000"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
}
