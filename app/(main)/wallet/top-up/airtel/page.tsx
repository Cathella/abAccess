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

// Airtel prefixes (first 2 digits after the leading 0)
const AIRTEL_PREFIXES = ["70", "74", "75"];

export default function AirtelMoneyPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const setTopUpData = useWalletStore((state) => state.setTopUpData);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(false);

  // Route protection: Require amount and payment method
  useEffect(() => {
    if (!topUpData.amount || topUpData.amount <= 0) {
      router.replace("/wallet/top-up");
    } else if (topUpData.paymentMethod !== "airtel_money") {
      router.replace("/wallet/top-up/method");
    }
  }, [topUpData.amount, topUpData.paymentMethod, router]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Limit to 10 digits (with leading 0)
    const limitedDigits = digits.substring(0, 10);

    // Format as: 0XXX XXX XXX
    let formatted = "";
    if (limitedDigits.length > 0) {
      formatted += limitedDigits.substring(0, 4);
    }
    if (limitedDigits.length > 4) {
      formatted += " " + limitedDigits.substring(4, 7);
    }
    if (limitedDigits.length > 7) {
      formatted += " " + limitedDigits.substring(7, 10);
    }

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };

  // Validate Airtel number
  const isValidAirtel = (): boolean => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length !== 10) return false;
    if (digits[0] !== '0') return false;

    const prefix = digits.substring(1, 3); // Get first 2 digits after the 0
    return AIRTEL_PREFIXES.includes(prefix);
  };

  const handlePay = () => {
    if (!isValidAirtel()) return;

    // Convert to E.164 format (remove leading 0 and add +256)
    const digits = phoneNumber.replace(/\D/g, "");
    const e164Phone = `+256${digits.substring(1)}`; // Remove leading 0

    // Store in topUpData
    setTopUpData({
      phoneNumber: e164Phone,
      saveForFuture,
    });

    // Navigate to confirm
    router.push("/wallet/top-up/confirm");
  };

  const isValid = isValidAirtel();
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
        <h1 className="mt-6 text-xl font-bold text-neutral-900">
          Enter Airtel Money number
        </h1>

        {/* Subtitle */}
        <p className="mt-2 mb-8 text-base leading-[160%] text-neutral-700">
          Enter the Airtel number you want to pay from.
        </p>

        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="airtel-phone" className="text-base text-neutral-900">
            Airtel Money number
          </Label>
          <div className="relative mt-2">
            <Input
              id="airtel-phone"
              type="tel"
              inputMode="numeric"
              placeholder="0700 123 456"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="h-12 rounded-xl border-[1.5px] border-neutral-300 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          {phoneNumber && !isValid && (
            <p className="text-sm text-warning-900">
              Please enter a valid Airtel number (0700, 0740, 0750)
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
            className="text-base leading-none text-neutral-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save this number for future payments
          </label>
        </div>

        {/* Info Card */}
        <div className="rounded-xl bg-secondary-100 p-4">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-secondary-900/20">
            <Info className="h-6 w-6 text-neutral-900" />
            <span className="text-base font-semibold text-neutral-900">
              Payment prompt
            </span>
          </div>

          {/* Body */}
          <p className="mt-3 text-sm leading-[160%] text-neutral-900">
            You&apos;ll receive a payment prompt on this number. Make sure you have
            access to it.
          </p>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="p-6">
        <button
          onClick={handlePay}
          disabled={!isValid}
          className="h-12 w-full rounded-xl bg-primary-900 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pay {formatCurrency(displayAmount)}
        </button>
      </div>
    </div>
  );
}
