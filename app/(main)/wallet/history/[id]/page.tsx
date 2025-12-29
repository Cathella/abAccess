"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useWalletStore } from "@/stores/walletStore";
import { formatCurrency, getPaymentMethodName, formatPhoneNumber } from "@/lib/wallet";
import { formatDate } from "@/lib/utils/dateUtils";
import type { WalletTransaction } from "@/types";

interface TransactionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TransactionDetailPage({
  params,
}: TransactionDetailPageProps) {
  const router = useRouter();
  const transactions = useWalletStore((state) => state.transactions);

  // Unwrap params using React.use()
  const { id } = use(params);

  // Find transaction by ID
  const transaction = transactions.find((t) => t.id === id);

  // Redirect if transaction not found
  useEffect(() => {
    if (!transaction) {
      router.replace("/wallet/history");
    }
  }, [transaction, router]);

  if (!transaction) {
    return null;
  }

  const isTopUp = transaction.type === "top_up";
  const isPurchase = transaction.type === "purchase";

  // Format transaction details
  const transactionDate = new Date(transaction.createdAt);
  const formattedDate = formatDate(transactionDate);
  const formattedTime = transactionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const paymentMethodName = getPaymentMethodName(transaction.paymentMethod);

  const handleReportIssue = () => {
    // Open email client or support modal
    const subject = encodeURIComponent(
      `Issue with Transaction ${transaction.transactionId}`
    );
    const body = encodeURIComponent(
      `I would like to report an issue with the following transaction:\n\nTransaction ID: ${transaction.transactionId}\nType: ${transaction.type === "top_up" ? "Top Up" : "Package Purchase"}\nAmount: ${formatCurrency(transaction.amount)}\nDate: ${formattedDate} at ${formattedTime}\n\nIssue description:\n`
    );
    // use assign() to navigate to mailto without assigning a read-only property
    window.location.assign(`mailto:support@abaccess.com?subject=${subject}&body=${body}`);
  };

  const handleViewPackage = () => {
    // Navigate to package details page
    // TODO: Need to link to actual package ID
    router.push("/my-packages");
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Transaction Details" showBack />

      {/* Divider */}
      <div className="h-px bg-neutral-400" />

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Card Container */}
        <div className="rounded-2xl border border-neutral-400 bg-white p-6">
          {/* Icon Circle */}
          <div className="flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                isTopUp ? "bg-primary-100" : "bg-error-100"
              }`}
            >
              {isTopUp ? (
                <ArrowDownToLine className="h-8 w-8 text-neutral-900" />
              ) : (
                <ArrowUpToLine className="h-8 w-8 text-neutral-900" />
              )}
            </div>
          </div>

          {/* Type Label */}
          <p className="mt-3 text-center text-sm text-neutral-700">
            {isTopUp ? "Top Up" : "Package Purchase"}
          </p>

          {/* Amount Badge */}
          <div className="mt-2 flex justify-center">
            <div
              className={`rounded-full px-4 py-2 text-base font-semibold ${
                isTopUp
                  ? "bg-primary-100 text-neutral-900"
                  : "bg-error-100 text-neutral-900"
              }`}
            >
              {isTopUp ? "+ " : "- "}
              {formatCurrency(transaction.amount)}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4 mt-6 bg-neutral-200 p-4 border-t border-neutral-400">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Status</span>
              <span className="text-sm text-neutral-900">
                {getStatusLabel(transaction.status)}
              </span>
            </div>

            {/* Transaction ID */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Transaction ID</span>
              <span className="text-sm text-neutral-900">
                {transaction.transactionId}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Date</span>
              <span className="text-sm text-neutral-900">{formattedDate}</span>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Time</span>
              <span className="text-sm text-neutral-900">{formattedTime}</span>
            </div>

            {/* Payment method */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Payment method</span>
              <span className="text-sm text-neutral-900">
                {paymentMethodName}
              </span>
            </div>

            {/* Phone number (for mobile money) */}
            {transaction.phoneNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Phone number</span>
                <span className="text-sm text-neutral-900">
                  {formatPhoneNumber(transaction.phoneNumber)}
                </span>
              </div>
            )}

            {/* Card (for card payments) */}
            {transaction.cardLast4 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Card</span>
                <span className="text-sm text-neutral-900">
                  **** **** **** {transaction.cardLast4}
                </span>
              </div>
            )}

            {/* Package name (for purchases) */}
            {isPurchase && transaction.packageName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Package</span>
                <span className="text-sm text-neutral-900">
                  {transaction.packageName}
                  {transaction.packageVisits &&
                    ` (${transaction.packageVisits} Visits Pack)`}
                </span>
              </div>
            )}

            {/* Amount */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Amount</span>
              <span className="text-sm text-neutral-900">
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            {/* Fee */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Fee</span>
              <span className="text-sm text-neutral-900">
                {formatCurrency(transaction.fee)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 space-y-4">
          {isTopUp ? (
            // Top Up: Report an issue button
            <button
              onClick={handleReportIssue}
              className="h-12 w-full rounded-xl border-[1.5px] border-neutral-900 bg-primary-100 text-base font-bold text-neutral-900 transition-colors hover:bg-primary-200"
            >
              Report an issue
            </button>
          ) : (
            // Purchase: Report issue link + View package button
            <>
              <button
                onClick={handleViewPackage}
                className="h-14 w-full rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800"
              >
                View package
              </button>
              <button
                onClick={handleReportIssue}
                className="w-full text-center text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Report an issue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
