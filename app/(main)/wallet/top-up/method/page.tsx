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

  // Get the most recent saved method for each type (to avoid duplicates)
  const getMostRecentMethod = (type: PaymentMethodType) => {
    return savedPaymentMethods
      .filter((m) => m.type === type)
      .sort((a, b) => {
        // Assuming newer IDs or add a timestamp if available
        return b.id.localeCompare(a.id);
      })[0];
  };

  const savedMTN = getMostRecentMethod("mtn_momo");
  const savedAirtel = getMostRecentMethod("airtel_money");
  const savedCard = getMostRecentMethod("card");

  // Add saved payment methods (only the most recent for each type)
  if (savedMTN && savedMTN.phoneNumber) {
    paymentOptions.push({
      id: savedMTN.id,
      type: "mtn_momo",
      label: "MTN MoMo",
      accountInfo: savedMTN.phoneNumber,
      isSaved: true,
      savedMethod: savedMTN,
    });
  }

  if (savedAirtel && savedAirtel.phoneNumber) {
    paymentOptions.push({
      id: savedAirtel.id,
      type: "airtel_money",
      label: "Airtel Money",
      accountInfo: savedAirtel.phoneNumber,
      isSaved: true,
      savedMethod: savedAirtel,
    });
  }

  if (savedCard && savedCard.cardLast4) {
    paymentOptions.push({
      id: savedCard.id,
      type: "card",
      label: savedCard.cardBrand || "Visa",
      accountInfo: `•••• ${savedCard.cardLast4}`,
      isSaved: true,
      savedMethod: savedCard,
    });
  }

  // Always add "Add new" option for each payment type that doesn't have a saved method
  if (!savedMTN) {
    paymentOptions.push({
      id: "new-mtn",
      type: "mtn_momo",
      label: "MTN MoMo",
      accountInfo: "Add new",
      isSaved: false,
    });
  }

  if (!savedAirtel) {
    paymentOptions.push({
      id: "new-airtel",
      type: "airtel_money",
      label: "Airtel Money",
      accountInfo: "Add new",
      isSaved: false,
    });
  }

  if (!savedCard) {
    paymentOptions.push({
      id: "new-card",
      type: "card",
      label: "Card",
      accountInfo: "Add new",
      isSaved: false,
    });
  }

  const handleOptionSelect = (option: PaymentOption) => {
    setSelectedOption(option);
  };

  const handleEditPaymentMethod = (e: React.MouseEvent, type: PaymentMethodType) => {
    e.stopPropagation(); // Prevent radio button selection

    // Keep the amount, set payment method type, clear other data
    setTopUpData({
      amount: topUpData.amount,
      paymentMethod: type,
      phoneNumber: undefined,
      cardDetails: undefined,
      saveForFuture: false,
    });

    // Navigate to the appropriate entry page
    switch (type) {
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
            Choose how you&apos;d like to pay.
          </p>

          <div className="p-4 bg-neutral-200">
            {/* Amount Row */}
            <div className="flex items-center justify-between border-b-[1.5px] border-neutral-400 pb-4">
              <span className="text-base text-neutral-900">
                Pay now
              </span>
              <span className="text-base font-bold text-neutral-900">
                {topUpData.amount ? formatCurrency(topUpData.amount) : "UGX 0"}
              </span>
            </div>

            {/* Payment Method Label */}
            <div className="mt-4 mb-3">
              <span className="text-base font-bold text-neutral-900">
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
                      <>
                        {option.isSaved ? (
                          <span
                            onClick={(e) => handleEditPaymentMethod(e, option.type)}
                            className="text-base font-semibold text-secondary-900 underline cursor-pointer hover:opacity-70 transition-opacity"
                          >
                            {option.accountInfo}
                          </span>
                        ) : (
                          <span className="text-base font-semibold text-secondary-900 underline">
                            {option.accountInfo}
                          </span>
                        )}
                      </>
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
      </div>

      {/* Bottom Fixed */}
      <div className="p-6">
        {/* Go Back Link */}
        <button
          onClick={handleGoBack}
          className="mb-3 w-full text-center text-base font-bold text-neutral-900 transition-opacity hover:opacity-70"
        >
          Go back
        </button>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedOption}
          className="h-12 w-full rounded-xl bg-primary-900 text-base font-bold border-[1.5px] border-neutral-900 text-neutral-900 transition-colors hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
