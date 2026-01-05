"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import CopayInfoCard from "@/components/cards/CopayInfoCard";
import { useRedemptionStore } from "@/stores/redemptionStore";
import { getCategoryDisplayName } from "@/lib/packages";

export default function ConfirmCopayPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;

  const { session, setCopayAcknowledged, generateCode } = useRedemptionStore();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Redirect if no session or member not selected
    if (!session || !session.selectedMemberId) {
      router.push(`/redeem/${packageId}/select-member`);
    }
  }, [session, packageId, router]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    setCopayAcknowledged(checked);
  };

  const handleGenerateCode = () => {
    if (!isChecked) return;
    generateCode();
    router.push(`/redeem/${packageId}/qr-code`);
  };

  if (!session || !session.package) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  const pkg = session.package;
  const copayAmount = pkg.package.copay;
  const categoryName = getCategoryDisplayName(pkg.package.category);
  const packageName = pkg.package.name;
  const visitsRemaining = pkg.remainingVisits;
  const totalVisits = pkg.totalVisits;
  const memberName = session.selectedMemberName;

  // Format copay for checkbox text
  const formattedCopay = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(copayAmount);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-200">
      {/* Header */}
      <Header title="Use package" showBack={true} />

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-32">
        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Confirm co-pay
        </h1>
        <p className="text-neutral-600 mb-6">
          You'll need to pay the co-pay at the facility during your visit.
        </p>

        {/* Package Summary Card */}
        <div className="rounded-2xl border border-neutral-400 bg-white p-4 mb-4">
          {/* Category & Package Name */}
          <h2 className="text-xl font-bold text-neutral-900 text-center mb-1">
            {categoryName}
          </h2>
          <p className="text-gray-500 text-center mb-4">
            {packageName}
          </p>

          {/* Divider */}
          <div className="mb-4 h-px bg-neutral-400" />

          {/* Info Rows */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            {/* Visit For */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">Visit for</span>
              <span className="font-semibold text-neutral-900">
                {memberName}
              </span>
            </div>

            {/* Visits Remaining */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">Visits remaining</span>
              <span className="font-semibold text-neutral-900">
                {visitsRemaining} of {totalVisits}
              </span>
            </div>
          </div>
        </div>

        {/* Copay Info Card */}
        <CopayInfoCard amount={copayAmount} />

        {/* Checkbox */}
        <div className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-900 focus:ring-primary-900"
            />
            <span className="text-neutral-700">
              I understand I'll pay {formattedCopay} at the facility
            </span>
          </label>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <button
          onClick={handleGenerateCode}
          disabled={!isChecked}
          className={`w-full rounded-full py-4 text-base font-semibold transition-all ${
            isChecked
              ? "bg-primary-900 text-white border-2 border-neutral-900"
              : "bg-neutral-400 text-neutral-600 cursor-not-allowed"
          }`}
        >
          Generate code
        </button>
      </div>
    </div>
  );
}
