"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency } from "@/lib/wallet";

const MIN_AMOUNT = 5000;
const MAX_AMOUNT = 5000000;

export default function TopUpAmountPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const setTopUpData = useWalletStore((state) => state.setTopUpData);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const numericValue = value === "" ? 0 : parseInt(value, 10);

    // Enforce maximum amount
    if (numericValue <= MAX_AMOUNT) {
      setAmount(numericValue);
    }
  };

  const handleContinue = () => {
    if (amount >= MIN_AMOUNT) {
      // Store amount in wallet store
      setTopUpData({ amount });
      // Navigate to payment method selection
      router.push("/wallet/top-up/method");
    }
  };

  const handleCardClick = () => {
    // Focus input when card is clicked
    inputRef.current?.focus();
  };

  // Format amount for display
  const formattedAmount = amount > 0 ? formatCurrency(amount, false) : "0.00";

  // Check if continue button should be enabled
  const isValidAmount = amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Top Up" showBack />

      {/* Divider */}
      <div className="h-px bg-neutral-400" />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center px-6 pt-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-neutral-900">Enter amount</h1>

        {/* Subtitle */}
        <p className="mt-2 mb-8 text-center text-base text-neutral-600">
          How much would you like to add to your wallet?
        </p>

        {/* Amount Input Card */}
        <div
          onClick={handleCardClick}
          className="w-full cursor-text rounded-2xl border border-neutral-400 bg-white p-6"
        >
          {/* Hidden input for actual value */}
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            className="absolute opacity-0"
            value={amount || ""}
            onChange={handleAmountChange}
            aria-label="Enter amount"
          />

          {/* Amount display */}
          <div className="text-center text-4xl font-bold text-neutral-900">
            {formattedAmount}
          </div>
        </div>

        {/* Minimum text */}
        <p className="mt-3 text-sm text-neutral-600">
          Minimum: {formatCurrency(MIN_AMOUNT)}
        </p>
      </div>

      {/* Bottom Fixed Button */}
      <div className="p-6">
        <button
          onClick={handleContinue}
          disabled={!isValidAmount}
          className="h-14 w-full rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
