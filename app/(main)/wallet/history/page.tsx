"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Calendar,
  ChevronRight,
  ArrowDownToLine,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/common/Header";
import { useWalletStore } from "@/stores/walletStore";
import {
  groupTransactionsByMonth,
  getMonthLabel,
  formatCurrency,
} from "@/lib/wallet";
import { formatDate } from "@/lib/utils/dateUtils";
import type { WalletTransaction, WalletTransactionType } from "@/types";

type FilterOption = "all" | "top_up" | "purchase";

export default function TransactionHistoryPage() {
  const router = useRouter();
  const transactions = useWalletStore((state) => state.transactions);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterOption>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(query) ||
          t.packageName?.toLowerCase().includes(query) ||
          t.amount.toString().includes(query) ||
          t.phoneNumber?.includes(query)
      );
    }

    return filtered;
  }, [transactions, filterType, searchQuery]);

  // Group transactions by month
  const groupedTransactions = useMemo(() => {
    return groupTransactionsByMonth(filteredTransactions);
  }, [filteredTransactions]);

  const handleTransactionClick = (transactionId: string) => {
    router.push(`/wallet/history/${transactionId}`);
  };

  const getFilterLabel = (filter: FilterOption): string => {
    switch (filter) {
      case "all":
        return "All transactions";
      case "top_up":
        return "Top-ups";
      case "purchase":
        return "Purchases";
      default:
        return "All transactions";
    }
  };

  const getTransactionTitle = (transaction: WalletTransaction): string => {
    if (transaction.type === "top_up") {
      return "Top Up";
    }
    return transaction.packageName || "Package Purchase";
  };

  const getTransactionSubtitle = (transaction: WalletTransaction): string => {
    const paymentMethod =
      transaction.paymentMethod === "mtn_momo"
        ? "MTN MoMo"
        : transaction.paymentMethod === "airtel_money"
        ? "Airtel Money"
        : "Card";

    const date = new Date(transaction.createdAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let dateLabel = "";
    if (isToday) {
      dateLabel = `Today, ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else if (isYesterday) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = formatDate(transaction.createdAt);
    }

    if (transaction.type === "top_up") {
      return `${paymentMethod} · ${dateLabel}`;
    }
    return `Package purchase · ${dateLabel}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Content */}
      <div className="flex-1 px-6 pt-16.25 pb-6 overflow-auto">
        {/* Search Input */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-xl border-[1.5px] border-neutral-400 bg-white px-4 pr-12 text-base placeholder:text-neutral-600 focus:border-primary-900 focus:outline-none"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
        </div>

        {/* Filter Row */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-medium text-neutral-900">
            Transactions Filter
          </span>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 rounded-lg border-[1.5px] border-neutral-400 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              {getFilterLabel(filterType)}
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showFilterDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-neutral-400 bg-white py-2 shadow-lg">
                  {(["all", "top_up", "purchase"] as FilterOption[]).map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterType(option);
                          setShowFilterDropdown(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-neutral-900 transition-colors hover:bg-neutral-100"
                      >
                        {/* Radio button */}
                        <div
                          className={`h-5 w-5 rounded-full border-2 ${
                            filterType === option
                              ? "border-secondary-900 bg-secondary-900"
                              : "border-neutral-400 bg-white"
                          } flex items-center justify-center`}
                        >
                          {filterType === option && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        {getFilterLabel(option)}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transactions List */}
        <div className="pb-4">
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="mt-24 text-center">
              <p className="text-base text-neutral-600">No transactions found</p>
            </div>
          ) : (
            Object.entries(groupedTransactions).map(
              ([monthYear, monthTransactions]) => (
                <div key={monthYear}>
                  {/* Month Header */}
                  <div className="mt-6 mb-4 flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4 text-neutral-600" />
                    <span className="text-sm font-medium text-neutral-600">
                      {getMonthLabel(monthYear)}
                    </span>
                  </div>

                  {/* Transaction Cards */}
                  {monthTransactions.map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction.id)}
                      className="mb-3 w-full rounded-2xl border border-neutral-400 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
                    >
                      {/* Top Row */}
                      <div className="flex items-start gap-3">
                        {/* Icon Circle */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                            transaction.type === "top_up"
                              ? "bg-primary-100"
                              : "bg-error-100"
                          }`}
                        >
                          {transaction.type === "top_up" ? (
                            <ArrowDownToLine className="h-6 w-6 text-neutral-900" />
                          ) : (
                            <ShoppingBag className="h-6 w-6 text-neutral-900" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <p className="text-base font-semibold text-neutral-900">
                            {getTransactionTitle(transaction)}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {getTransactionSubtitle(transaction)}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="my-3 h-px bg-neutral-400" />

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between">
                        {/* Amount Badge */}
                        <div
                          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                            transaction.type === "top_up"
                              ? "bg-primary-100 text-neutral-900"
                              : "bg-error-100 text-neutral-900"
                          }`}
                        >
                          {transaction.type === "top_up" ? "+ " : "- "}
                          {formatCurrency(transaction.amount)}
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="h-5 w-5 text-neutral-600" />
                      </div>
                    </button>
                  ))}
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* Fixed Header at Bottom */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Header title="Transaction History" showBack />
        <div className="h-px bg-neutral-400" />
      </div>
    </div>
  );
}
