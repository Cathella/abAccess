"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency, formatPhoneNumber } from "@/lib/wallet";
import { Info } from "lucide-react";

export default function TopUpConfirmPage() {
  const router = useRouter();
  const topUpData = useWalletStore((state) => state.topUpData);
  const savedPaymentMethods = useWalletStore(
    (state) => state.savedPaymentMethods
  );
  const clearTopUpData = useWalletStore((state) => state.clearTopUpData);

  // Route protection: Require amount and payment method
  useEffect(() => {
    if (!topUpData.amount || topUpData.amount <= 0) {
      router.replace("/wallet/top-up");
    } else if (!topUpData.paymentMethod) {
      router.replace("/wallet/top-up/method");
    }
  }, [topUpData.amount, topUpData.paymentMethod, router]);

  // Get amount and payment method
  const amount = topUpData.amount || 0;
  const paymentMethod = topUpData.paymentMethod;

  // Calculate fee based on payment method
  const calculateFee = () => {
    if (paymentMethod === "card") {
      return Math.round(amount * 0.025); // 2.5% for card
    }
    return 0; // No fee for mobile money
  };

  const fee = calculateFee();
  const totalAmount = amount + fee;

  // Get payment method display info
  const getPaymentMethodDisplay = () => {
    if (paymentMethod === "mtn_momo") {
      return {
        label: "MTN MoMo",
        accountInfo: topUpData.phoneNumber
          ? formatPhoneNumber(topUpData.phoneNumber)
          : "",
      };
    } else if (paymentMethod === "airtel_money") {
      return {
        label: "Airtel Money",
        accountInfo: topUpData.phoneNumber
          ? formatPhoneNumber(topUpData.phoneNumber)
          : "",
      };
    } else if (paymentMethod === "card") {
      // Try to get card info from topUpData or saved methods
      const cardLast4 = topUpData.cardDetails
        ? topUpData.cardDetails.number.slice(-4)
        : savedPaymentMethods.find((m) => m.type === "card")?.cardLast4;

      const cardBrand = savedPaymentMethods.find((m) => m.type === "card")
        ?.cardBrand || "Visa";

      return {
        label: cardBrand,
        accountInfo: cardLast4 ? `•••• ${cardLast4}` : "",
      };
    }

    return { label: "", accountInfo: "" };
  };

  const paymentMethodDisplay = getPaymentMethodDisplay();
  const isMobileMoney = paymentMethod === "mtn_momo" || paymentMethod === "airtel_money";

  const handleCancel = () => {
    // Clear top up data and navigate back to dashboard
    clearTopUpData();
    router.push("/dashboard");
  };

  const handlePay = () => {
    // Navigate to processing page
    router.push("/wallet/top-up/processing");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Transaction Details" showBack />

      {/* Divider */}
      <div className="h-px bg-neutral-400" />

      {/* Content */}
      <div className="flex-1 px-6 pt-6">
        {/* Confirmation Card */}
        <div className="rounded-2xl border-[1.5px] border-neutral-400 bg-white p-4">
          {/* Title */}
          <h1 className="text-center text-xl font-bold text-neutral-900">
            Confirm top up
          </h1>

          {/* Subtitle */}
          <p className="mt-2 mb-6 text-center text-sm text-neutral-700">
            Review your top up details.
          </p>

          {/* Details Box */}
          <div className="border-t-[1.5px] border-neutral-400 bg-neutral-200 p-4">
            {/* Amount */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-neutral-600">Amount</span>
              <span className="text-sm text-neutral-900">
                {formatCurrency(amount)}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-neutral-600">Payment method</span>
              <span className="text-sm text-neutral-900">
                {paymentMethodDisplay.label}
              </span>
            </div>

            {/* Phone/Card Number */}
            {paymentMethodDisplay.accountInfo && (
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-neutral-600">
                  {isMobileMoney ? "Phone" : "Card"}
                </span>
                <span className="text-sm text-neutral-900">
                  {paymentMethodDisplay.accountInfo}
                </span>
              </div>
            )}

            {/* Fee */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-neutral-600">
                {paymentMethod === "card" ? "Processing fee (2.5%)" : "Fee"}
              </span>
              <span className="text-sm text-neutral-900">
                {formatCurrency(fee)}
              </span>
            </div>

            {/* Divider */}
            <div className="my-2 h-px bg-neutral-300" />

            {/* Total */}
            <div className="flex items-center justify-between py-2">
              <span className="text-base font-semibold text-neutral-900">
                Total to pay
              </span>
              <span className="text-base font-semibold text-neutral-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-xl bg-secondary-100 p-4 mt-6">
          {/* Header */}
          <div className="mb-3 flex items-center gap-2 pb-3 border-b border-secondary-900/20">
            <Info className="h-6 w-6 text-neutral-900" />
            <span className="text-base font-semibold text-neutral-900">
              {isMobileMoney ? "What happens next?" : "Card payments"}
            </span>
          </div>

          {/* Body */}
          <p className="text-sm leading-[160%] text-neutral-900">
            {isMobileMoney
              ? "You'll receive a prompt on your phone to confirm the payment with your Mobile Money PIN."
              : "A small processing fee applies to card payments. Mobile money has no fees."}
          </p>
        </div>
      </div>

      {/* Bottom Fixed */}
      <div className="p-6">
        {/* Cancel Link */}
        <button
          onClick={handleCancel}
          className="mb-3 w-full text-center text-base font-bold text-neutral-900 transition-opacity hover:opacity-70"
        >
          Cancel
        </button>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          className="h-12 w-full rounded-xl bg-primary-900 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-primary-800"
        >
          Pay {formatCurrency(totalAmount)}
        </button>
      </div>
    </div>
  );
}
