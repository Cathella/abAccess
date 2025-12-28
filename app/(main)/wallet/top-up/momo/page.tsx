"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency } from "@/lib/wallet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";

// MTN prefixes
const MTN_PREFIXES = ["076", "077", "078"];

export default function MtnMomoPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const setTopUpData = useWalletStore((state) => state.setTopUpData);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(false);

  // Route protection: Require amount and payment method
  useEffect(() => {
    if (!topUpData.amount || topUpData.amount <= 0) {
      router.replace("/wallet/top-up");
    } else if (topUpData.paymentMethod !== "mtn_momo") {
      router.replace("/wallet/top-up/method");
    }
  }, [topUpData.amount, topUpData.paymentMethod, router]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Limit to 9 digits (without leading 0)
    const limitedDigits = digits.substring(0, 9);

    // Format as: XXX XXX XXX
    let formatted = "";
    if (limitedDigits.length > 0) {
      formatted += limitedDigits.substring(0, 3);
    }
    if (limitedDigits.length > 3) {
      formatted += " " + limitedDigits.substring(3, 6);
    }
    if (limitedDigits.length > 6) {
      formatted += " " + limitedDigits.substring(6, 9);
    }

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };

  // Validate MTN number
  const isValidMTN = (): boolean => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length !== 9) return false;

    const prefix = digits.substring(0, 3);
    return MTN_PREFIXES.includes(prefix);
  };

  const handlePay = () => {
    if (!isValidMTN()) return;

    // Convert to E.164 format
    const digits = phoneNumber.replace(/\D/g, "");
    const e164Phone = `+256${digits}`;

    // Store in topUpData
    setTopUpData({
      phoneNumber: e164Phone,
      saveForFuture,
    });

    // Navigate to confirm
    router.push("/wallet/top-up/confirm");
  };

  const isValid = isValidMTN();
  const displayAmount = topUpData.amount || 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Top Up" showBack />

      {/* Divider */}
      <div className="h-px bg-neutral-400" />

      {/* Content */}
      <div className="flex-1 px-6">
        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-neutral-900">
          Enter mobile money number
        </h1>

        {/* Subtitle */}
        <p className="mt-2 mb-8 text-base leading-[160%] text-neutral-600">
          Enter the MTN number you want to pay from.
        </p>

        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="mtn-phone" className="text-sm font-medium text-neutral-900">
            MTN Mobile Money number
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-base text-neutral-900">
              +256
            </div>
            <Input
              id="mtn-phone"
              type="tel"
              inputMode="numeric"
              placeholder="7XX XXX XXX"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="h-12 rounded-xl border-[1.5px] border-neutral-300 pl-16 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          {phoneNumber && !isValid && (
            <p className="text-sm text-warning-900">
              Please enter a valid MTN number (076, 077, 078)
            </p>
          )}
        </div>

        {/* Save Checkbox */}
        <div className="mt-4 mb-6 flex items-center space-x-2">
          <Checkbox
            id="save-number"
            checked={saveForFuture}
            onCheckedChange={(checked) => setSaveForFuture(checked as boolean)}
          />
          <label
            htmlFor="save-number"
            className="text-sm font-medium leading-none text-neutral-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save this number for future payments
          </label>
        </div>

        {/* Info Card */}
        <div className="rounded-xl bg-secondary-100 p-4">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-secondary-200">
            <Info className="h-4 w-4 text-neutral-900" />
            <span className="text-sm font-semibold text-neutral-900">
              Payment prompt
            </span>
          </div>

          {/* Body */}
          <p className="mt-3 text-sm leading-[160%] text-neutral-700">
            You'll receive a payment prompt on this number. Make sure you have
            access to it.
          </p>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="p-6">
        <button
          onClick={handlePay}
          disabled={!isValid}
          className="h-14 w-full rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
        >
          Pay {formatCurrency(displayAmount)}
        </button>
      </div>
    </div>
  );
}
