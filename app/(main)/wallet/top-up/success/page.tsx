"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency, generateTransactionId, getPaymentMethodName } from "@/lib/wallet";
import type { WalletTransaction } from "@/types";

export default function TopUpSuccessPage() {
  const router = useRouter();
  const balance = useWalletStore((state) => state.balance);
  const topUpData = useWalletStore((state) => state.topUpData);
  const addBalance = useWalletStore((state) => state.addBalance);
  const addTransaction = useWalletStore((state) => state.addTransaction);
  const addSavedPaymentMethod = useWalletStore((state) => state.addSavedPaymentMethod);
  const clearTopUpData = useWalletStore((state) => state.clearTopUpData);

  const [transaction, setTransaction] = useState<WalletTransaction | null>(null);

  const amount = topUpData.amount || 0;
  const paymentMethod = topUpData.paymentMethod;
  const phoneNumber = topUpData.phoneNumber;
  const cardDetails = topUpData.cardDetails;
  const saveForFuture = topUpData.saveForFuture;

  // Prevent back navigation and create transaction
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    // Create and add transaction
    if (amount > 0 && paymentMethod && !transaction) {
      const newTransaction: WalletTransaction = {
        id: crypto.randomUUID(),
        type: "top_up",
        amount,
        fee: 0,
        status: "completed",
        paymentMethod,
        phoneNumber,
        cardLast4: cardDetails ? cardDetails.number.slice(-4) : undefined,
        transactionId: generateTransactionId(),
        createdAt: new Date().toISOString(),
      };

      // Add balance and transaction
      addBalance(amount);
      addTransaction(newTransaction);
      setTransaction(newTransaction);

      // Save payment method if user opted in
      if (saveForFuture && paymentMethod) {
        if (paymentMethod === "mtn_momo" || paymentMethod === "airtel_money") {
          if (phoneNumber) {
            addSavedPaymentMethod({
              id: crypto.randomUUID(),
              type: paymentMethod,
              phoneNumber,
              isDefault: false,
            });
          }
        } else if (paymentMethod === "card" && cardDetails) {
          addSavedPaymentMethod({
            id: crypto.randomUUID(),
            type: "card",
            cardLast4: cardDetails.number.slice(-4),
            cardBrand: "Visa", // Default to Visa - could be determined from card number
            isDefault: false,
          });
        }
      }
    }

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, [amount, paymentMethod, phoneNumber, cardDetails, saveForFuture, addBalance, addTransaction, addSavedPaymentMethod, transaction]);

  const handleDone = () => {
    clearTopUpData();
    router.push("/dashboard");
  };

  const handleBrowsePackages = () => {
    clearTopUpData();
    router.push("/packages");
  };

  if (!transaction) {
    return null;
  }

  // Format transaction date and time
  const transactionDate = new Date(transaction.createdAt);
  const formattedDate = transactionDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = transactionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Get payment method display name
  const paymentMethodName = getPaymentMethodName(transaction.paymentMethod);

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-16">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center">
        {/* Celebration Icon */}
        <div className="mb-6 text-[64px] leading-none">🎊</div>

        {/* Title */}
        <h1 className="mb-3 text-center text-2xl font-bold text-neutral-900">
          Top up successful!
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-center text-base text-neutral-600">
          {formatCurrency(amount)} has been added to your wallet.
        </p>

        {/* Balance Card */}
        <div className="w-full rounded-2xl border border-neutral-400 bg-white p-6">
          {/* New Balance */}
          <div className="text-center">
            <div className="text-[32px] font-bold leading-none text-neutral-900">
              UGX. {formatCurrency(balance, false)}
            </div>
            <p className="mt-1 text-sm text-neutral-600">New balance</p>
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-neutral-400" />

          {/* Transaction Details */}
          <div className="space-y-3">
            {/* Transaction ID */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Transaction ID</span>
              <span className="text-sm text-neutral-900">{transaction.transactionId}</span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Date</span>
              <span className="text-sm text-neutral-900">
                {formattedDate}, {formattedTime}
              </span>
            </div>

            {/* Method */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Method</span>
              <span className="text-sm text-neutral-900">{paymentMethodName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed */}
      <div className="w-full pb-6 pt-4">
        {/* Browse packages link */}
        <button
          onClick={handleBrowsePackages}
          className="mb-3 w-full text-center text-sm font-medium text-neutral-900 transition-opacity hover:opacity-70"
        >
          Browse packages
        </button>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="h-14 w-full rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800"
        >
          Done
        </button>
      </div>
    </div>
  );
}
