"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import PaymentMethodSelector from "@/components/forms/PaymentMethodSelector";
import { Button } from "@/components/ui/button";
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
        <div className="bg-white rounded-2xl border border-neutral-400 p-6 space-y-6">
          {/* Category and Package name */}
          <div className="text-center space-y-1">
            <h2 className="font-bold text-xl text-neutral-900">{categoryName}</h2>
            <p className="text-gray-500">{selectedPackage.name}</p>
          </div>

          {/* Pricing section */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            {/* Pay now row */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Pay now</span>
              <span className="font-bold text-xl text-neutral-900">
                {formatCurrency(selectedPackage.price)}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-300" />

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
          style={{ backgroundColor: "#E8F4F1" }}
        >
          <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-300">
            Co-pay reminder
          </h3>
          <div className="mt-2 text-sm text-gray-700">
            You'll pay {formatCurrency(selectedPackage.copay)} at the facility during each visit.
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
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
            By purchasing, you agree to the{" "}
            <Link href="/terms" className="text-[#3A8DFF] underline">
              package terms and conditions
            </Link>
            .
          </label>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-400">
        <Button
          onClick={handleConfirm}
          disabled={!localTermsAccepted}
          className="w-full h-12 text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: localTermsAccepted ? "#32C28A" : undefined }}
        >
          {paymentMethod === "wallet" ? "Confirm & Pay" : "Pay with Mobile Money"}
        </Button>
      </div>
    </>
  );
}
