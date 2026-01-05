"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import PaymentMethodSelector from "@/components/forms/PaymentMethodSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { useWalletStore } from "@/stores/walletStore";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { PACKAGE_CATEGORIES } from "@/lib/constants";
import Link from "next/link";

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const balance = useWalletStore((state) => state.balance);
  const {
    selectedPackage,
    paymentMethod,
    setPaymentMethod,
    termsAccepted,
    setTermsAccepted,
  } = usePurchaseStore();

  const [localTermsAccepted, setLocalTermsAccepted] = useState(termsAccepted);

  // Get category name from package
  const categoryName = selectedPackage
    ? PACKAGE_CATEGORIES.find((cat) => cat.id === selectedPackage.categoryId)?.name || ""
    : "";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setLocalTermsAccepted(checked);
    setTermsAccepted(checked);
  };

  const handleConfirm = () => {
    if (paymentMethod === "wallet") {
      router.push("/packages/purchase/pin");
    } else {
      router.push("/packages/purchase/processing");
    }
  };

  if (!selectedPackage) {
    router.push("/packages");
    return null;
  }

  return (
    <>
      {/* Header */}
      <Header title="Confirm purchase" showBack />

      {/* Main content */}
      <div className="px-4 pt-6 pb-32 space-y-6">
        {/* Main card */}
        <div className="rounded-2xl border border-neutral-400 p-6 space-y-6">
          {/* Category and Package name */}
          <div className="text-center space-y-1">
            <h2 className="font-bold text-xl text-neutral-900">{categoryName}</h2>
            <p className="text-neutral-700 text-sm">{selectedPackage.name}</p>
          </div>

          {/* Pricing section */}
          <div className="bg-neutral-200 rounded-xl p-4 space-y-4">
            {/* Pay now row */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">Pay now</span>
              <span className="font-bold text-xl text-neutral-900">
                {formatCurrency(selectedPackage.price)}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-neutral-400" />

            {/* Payment method selector */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
              walletBalance={balance}
              packagePrice={selectedPackage.price}
            />
          </div>
        </div>

        {/* Co-pay reminder info card */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#DFF7EE" }}
        >
          <h3 className="font-bold text-base text-neutral-900 pb-2 border-b border-primary-900/20">
            Co-pay reminder
          </h3>
          <div className="mt-2 text-sm text-neutral-900">
            You&apos;ll pay {formatCurrency(selectedPackage.copay)} at the facility during each visit.
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={localTermsAccepted}
            onCheckedChange={handleCheckboxChange}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-neutral-900 cursor-pointer">
            By purchasing, you agree to the{" "}
            <Link href="/terms" className="text-secondary-900 font-bold underline">
              package terms and conditions
            </Link>
            .
          </label>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleConfirm}
          disabled={!localTermsAccepted}
          className="w-full h-12 rounded-xl font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: localTermsAccepted ? "#32C28A" : "#32C28A" }}
          onMouseEnter={(e) => {
            if (localTermsAccepted) {
              e.currentTarget.style.backgroundColor = "#2AAA75";
            }
          }}
          onMouseLeave={(e) => {
            if (localTermsAccepted) {
              e.currentTarget.style.backgroundColor = "#32C28A";
            }
          }}
        >
          {paymentMethod === "wallet" ? "Confirm & Pay" : "Pay with Mobile Money"}
        </button>
      </div>
    </>
  );
}
