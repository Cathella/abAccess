"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency } from "@/lib/wallet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";

// Card brand detection
const detectCardBrand = (cardNumber: string): string | null => {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.startsWith("4")) {
    return "Visa";
  }

  const firstTwo = parseInt(digits.substring(0, 2));
  const firstFour = parseInt(digits.substring(0, 4));

  if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) {
    return "Mastercard";
  }

  return null;
};

// Luhn algorithm validation
const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length !== 16) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Format card number with dashes
const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const limitedDigits = digits.substring(0, 16);

  let formatted = "";
  for (let i = 0; i < limitedDigits.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += " - ";
    }
    formatted += limitedDigits[i];
  }

  return formatted;
};

// Format expiry date as MM / YY
const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const limitedDigits = digits.substring(0, 4);

  let formatted = "";
  if (limitedDigits.length > 0) {
    formatted += limitedDigits.substring(0, 2);
  }
  if (limitedDigits.length > 2) {
    formatted += " / " + limitedDigits.substring(2, 4);
  }

  return formatted;
};

// Validate expiry date (must be future date)
const validateExpiry = (expiry: string): boolean => {
  const digits = expiry.replace(/\D/g, "");

  if (digits.length !== 4) return false;

  const month = parseInt(digits.substring(0, 2));
  const year = parseInt(digits.substring(2, 4));

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Get last 2 digits
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export default function CardEntryPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const setTopUpData = useWalletStore((state) => state.setTopUpData);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(false);

  const [cardBrand, setCardBrand] = useState<string | null>(null);

  // Route protection: Require amount and payment method
  useEffect(() => {
    if (!topUpData.amount || topUpData.amount <= 0) {
      router.replace("/wallet/top-up");
    } else if (topUpData.paymentMethod !== "card") {
      router.replace("/wallet/top-up/method");
    }
  }, [topUpData.amount, topUpData.paymentMethod, router]);

  // Detect card brand as user types
  useEffect(() => {
    const brand = detectCardBrand(cardNumber);
    setCardBrand(brand);
  }, [cardNumber]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const limited = digits.substring(0, 4);
    setCvv(limited);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Validation
  const isCardNumberValid = validateLuhn(cardNumber);
  const isExpiryValid = validateExpiry(expiry);
  const isCvvValid = cvv.length >= 3 && cvv.length <= 4;
  const isNameValid = name.trim().length >= 2;

  const isFormValid = isCardNumberValid && isExpiryValid && isCvvValid && isNameValid;

  // Calculate total with 2.5% fee
  const baseAmount = topUpData.amount || 0;
  const fee = baseAmount * 0.025;
  const totalAmount = baseAmount + fee;

  const handlePay = () => {
    if (!isFormValid) return;

    // Store card details in topUpData (temporarily, CVV not persisted)
    setTopUpData({
      cardDetails: {
        number: cardNumber.replace(/\D/g, ""),
        expiry: expiry.replace(/\D/g, ""),
        cvv,
        name: name.trim(),
      },
      saveForFuture,
    });

    // Navigate to confirm page
    router.push("/wallet/top-up/confirm");
  };

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
          Enter card details
        </h1>

        {/* Subtitle */}
        <p className="mt-2 mb-8 text-base text-neutral-600">
          Your card information is encrypted and secure.
        </p>

        {/* Card Number Input */}
        <div className="mb-5 space-y-2">
          <Label htmlFor="card-number" className="text-sm font-medium text-neutral-900">
            Card number
          </Label>
          <div className="relative">
            <Input
              id="card-number"
              type="text"
              inputMode="numeric"
              placeholder="0000 - 0000 - 0000 - 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="h-12 rounded-xl border-[1.5px] border-neutral-300 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {cardBrand && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-600">
                {cardBrand}
              </div>
            )}
          </div>
          {cardNumber && !isCardNumberValid && (
            <p className="text-sm text-warning-900">
              Please enter a valid card number
            </p>
          )}
        </div>

        {/* Expiry Date Input */}
        <div className="mb-5 space-y-2">
          <Label htmlFor="expiry" className="text-sm font-medium text-neutral-900">
            Expiry date
          </Label>
          <div className="relative">
            <Input
              id="expiry"
              type="text"
              inputMode="numeric"
              placeholder="MM / YY"
              value={expiry}
              onChange={handleExpiryChange}
              className="h-12 rounded-xl border-[1.5px] border-neutral-300 pr-12 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
          </div>
          {expiry && !isExpiryValid && (
            <p className="text-sm text-warning-900">
              Please enter a valid future date
            </p>
          )}
        </div>

        {/* CVV Input */}
        <div className="mb-5 space-y-2">
          <Label htmlFor="cvv" className="text-sm font-medium text-neutral-900">
            CVV
          </Label>
          <Input
            id="cvv"
            type="text"
            inputMode="numeric"
            placeholder="000"
            value={cvv}
            onChange={handleCvvChange}
            className="h-12 rounded-xl border-[1.5px] border-neutral-300 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {cvv && !isCvvValid && (
            <p className="text-sm text-warning-900">
              CVV must be 3-4 digits
            </p>
          )}
        </div>

        {/* Name Input */}
        <div className="mb-4 space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-neutral-900">
            Name on card
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Catherine Nakitto"
            value={name}
            onChange={handleNameChange}
            className="h-12 rounded-xl border-[1.5px] border-neutral-300 text-base placeholder:text-neutral-500 focus-visible:border-primary-900 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {name && !isNameValid && (
            <p className="text-sm text-warning-900">
              Name must be at least 2 characters
            </p>
          )}
        </div>

        {/* Save Checkbox */}
        <div className="mb-6 flex items-center space-x-2">
          <Checkbox
            id="save-card"
            checked={saveForFuture}
            onCheckedChange={(checked) => setSaveForFuture(checked as boolean)}
          />
          <label
            htmlFor="save-card"
            className="text-sm font-medium leading-none text-neutral-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save this card for future payments
          </label>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="p-6">
        <button
          onClick={handlePay}
          disabled={!isFormValid}
          className="h-14 w-full rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
        >
          Pay {formatCurrency(totalAmount)}
        </button>
      </div>
    </div>
  );
}
