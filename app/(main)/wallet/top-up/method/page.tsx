"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency } from "@/lib/wallet";
import type { PaymentMethodType, SavedPaymentMethod, TopUpData } from "@/types";

type PaymentOption = {
  id: string;
  type: PaymentMethodType;
  label: string;
  accountInfo?: string;
  isSaved: boolean;
  savedMethod?: SavedPaymentMethod;
};

export default function PaymentMethodPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const savedPaymentMethods = useWalletStore(
    (state) => state.savedPaymentMethods
  );
  const setTopUpData = useWalletStore((state) => state.setTopUpData);

  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(
    null
  );

  // Route protection: Require amount
  useEffect(() => {
    if (!topUpData.amount || topUpData.amount <= 0) {
      router.replace("/wallet/top-up");
    }
  }, [topUpData.amount, router]);

  // Build payment options from saved methods
  const paymentOptions: PaymentOption[] = [];

  // Add saved payment methods
  savedPaymentMethods.forEach((method) => {
    if (method.type === "mtn_momo" && method.phoneNumber) {
      paymentOptions.push({
        id: method.id,
        type: "mtn_momo",
        label: "MTN MoMo",
        accountInfo: method.phoneNumber,
        isSaved: true,
        savedMethod: method,
      });
    } else if (method.type === "airtel_money" && method.phoneNumber) {
      paymentOptions.push({
        id: method.id,
        type: "airtel_money",
        label: "Airtel Money",
        accountInfo: method.phoneNumber,
        isSaved: true,
        savedMethod: method,
      });
    } else if (method.type === "card" && method.cardLast4) {
      paymentOptions.push({
        id: method.id,
        type: "card",
        label: method.cardBrand || "Visa",
        accountInfo: `•••• ${method.cardLast4}`,
        isSaved: true,
        savedMethod: method,
      });
    }
  });

  // If no saved methods, add "Add new" options
  if (savedPaymentMethods.length === 0) {
    paymentOptions.push(
      {
        id: "new-mtn",
        type: "mtn_momo",
        label: "MTN MoMo",
        accountInfo: "Add new",
        isSaved: false,
      },
      {
        id: "new-airtel",
        type: "airtel_money",
        label: "Airtel Money",
        accountInfo: "Add new",
        isSaved: false,
      },
      {
        id: "new-card",
        type: "card",
        label: "Card",
        accountInfo: "Add new",
        isSaved: false,
      }
    );
  }

  const handleOptionSelect = (option: PaymentOption) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    if (selectedOption.isSaved) {
      // Saved method - store payment method and saved data, then go to confirm page
      const updateData: Partial<TopUpData> = {
        paymentMethod: selectedOption.type,
      };

      // Store saved payment method data
      if (selectedOption.savedMethod) {
        if (selectedOption.savedMethod.phoneNumber) {
          updateData.phoneNumber = selectedOption.savedMethod.phoneNumber;
        }
        if (selectedOption.savedMethod.cardLast4) {
          // For saved cards, we don't have full card details, but we can store partial info
          updateData.cardDetails = {
            number: "************" + selectedOption.savedMethod.cardLast4,
            expiry: "",
            cvv: "",
            name: "",
          };
        }
      }

      setTopUpData(updateData);
      router.push("/wallet/top-up/confirm");
    } else {
      // New method - navigate to entry screen
      setTopUpData({ paymentMethod: selectedOption.type });
      switch (selectedOption.type) {
        case "mtn_momo":
          router.push("/wallet/top-up/momo");
          break;
        case "airtel_money":
          router.push("/wallet/top-up/airtel");
          break;
        case "card":
          router.push("/wallet/top-up/card");
          break;
      }
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Top Up" showBack />

      {/* Divider */}
      <div className="h-px bg-neutral-400" />

      {/* Content */}
      <div className="flex-1 px-6 pt-6">
        {/* Payment Method Card */}
        <div className="rounded-2xl border border-neutral-400 bg-white p-6">
          {/* Title */}
          <h1 className="text-center text-xl font-bold text-neutral-900">
            Select payment method
          </h1>

          {/* Subtitle */}
          <p className="mt-2 mb-6 text-center text-sm text-neutral-600">
            Choose how you'd like to pay.
          </p>

          {/* Amount Row */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <span className="text-sm font-medium text-neutral-600">
              Pay now
            </span>
            <span className="text-base font-semibold text-neutral-900">
              {topUpData.amount ? formatCurrency(topUpData.amount) : "UGX 0"}
            </span>
          </div>

          {/* Payment Method Label */}
          <div className="mt-4 mb-3">
            <span className="text-sm font-medium text-neutral-900">
              Payment method
            </span>
          </div>

          {/* Payment Method Options */}
          <div>
            {paymentOptions.map((option, index) => (
              <div key={option.id}>
                <button
                  onClick={() => handleOptionSelect(option)}
                  className="flex w-full items-center gap-3 py-4 text-left transition-opacity hover:opacity-70"
                >
                  {/* Radio Button */}
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {selectedOption?.id === option.id ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-900">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary-900" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-neutral-400" />
                    )}
                  </div>

                  {/* Method Name */}
                  <span className="flex-1 text-base text-neutral-900">
                    {option.label}
                  </span>

                  {/* Account Info */}
                  {option.accountInfo && (
                    <span className="text-sm text-[#3A8DFF]">
                      {option.accountInfo}
                    </span>
                  )}
                </button>

                {/* Divider (except last item) */}
                {index < paymentOptions.length - 1 && (
                  <div className="h-px bg-neutral-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fixed */}
      <div className="p-6">
        {/* Go Back Link */}
        <button
          onClick={handleGoBack}
          className="mb-3 w-full text-center text-sm font-medium text-neutral-900 transition-opacity hover:opacity-70"
        >
          Go back
        </button>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedOption}
          className="h-14 w-full rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
