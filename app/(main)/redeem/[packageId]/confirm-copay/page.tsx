"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import CopayInfoCard from "@/components/cards/CopayInfoCard";
import { useRedemptionStore } from "@/stores/redemptionStore";

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
    } else if (!session.facilityName) {
      router.push(`/redeem/${packageId}/select-facility`);
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

  if (!session || !session.package || !session.package.package) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  const pkg = session.package;
  const packageInfo = pkg.package!;
  const copayAmount = packageInfo.copay;
  const categoryName = packageInfo.category;
  const packageName = packageInfo.name;
  const visitsRemaining = pkg.visitsRemaining;
  const totalVisits = packageInfo.visitCount;
  const memberName = session.selectedMemberName;

  // Format copay for checkbox text
  const formattedCopay = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(copayAmount);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Use package" showBack={true} />

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-32">
        {/* Title & Subtitle */}
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          Confirm co-pay
        </h1>
        <p className="text-neutral-700 mb-6">
          You&apos;ll need to pay the co-pay at the facility during your visit.
        </p>

        {/* Package Summary Card */}
        <div className="rounded-4xl border border-neutral-400 bg-white p-4 mb-4">
          {/* Category & Package Name */}
          <h2 className="text-lg font-bold text-neutral-900 text-center mb-1">
            {categoryName}
          </h2>
          <p className="text-neutral-700 text-center mb-4">
            {packageName}
          </p>

          {/* Divider */}
          <div className="h-px bg-neutral-400" />

          {/* Info Rows */}
          <div className="bg-neutral-200 p-4 space-y-3">
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
              className="mt-1 h-5 w-5 rounded border-neutral-400 text-primary-900 focus:ring-primary-900"
            />
            <span className="text-neutral-700">
              I understand I&apos;ll pay {formattedCopay} at the facility
            </span>
          </label>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <PrimaryButton onClick={handleGenerateCode} disabled={!isChecked}>
          Generate code
        </PrimaryButton>
      </div>
    </div>
  );
}
