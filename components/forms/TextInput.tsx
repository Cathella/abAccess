"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, helperText, onChange, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={props.id}
            className={cn(
              "text-base mb-2 block text-neutral-900",
              error && "text-destructive"
            )}
          >
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          onChange={handleChange}
          className={cn(
            "h-12 rounded-xl border-[1.5px] border-neutral-300 px-4 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0",
            error && "border-destructive focus-visible:border-destructive",
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-sm text-neutral-600">{helperText}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
