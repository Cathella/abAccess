"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRedemptionStore } from "@/stores/redemptionStore";
import { usePackageStore } from "@/stores/packageStore";
import { recordPackageUsage } from "@/lib/packages";
import { createVisitForRedemption } from "@/lib/supabase/visits";

export default function RedemptionSuccessPage() {
  const router = useRouter();
  const { session, resetRedemption } = useRedemptionStore();
  const { recordUsage } = usePackageStore();
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    // Redirect if no session
    if (!session) {
      router.push("/my-packages");
      return;
    }

    if (hasRecordedRef.current) return;
    hasRecordedRef.current = true;

    const persistVisit = async () => {
      if (!session.package || !session.selectedMemberId || !session.selectedMemberName) {
        return;
      }

      const visitDate = session.visitDate || new Date().toISOString();
      const copayPaid = session.copayPaid ?? session.package?.package?.copay ?? 0;
      const facilityName = session.facilityName || "Partner Facility";
      const dependentId =
        session.selectedMemberId === session.package.userId
          ? null
          : session.selectedMemberId;
      const qrCode = session.activeCode?.code || `redeem-${Date.now()}`;

      const visitResult = await createVisitForRedemption({
        userPackageId: session.package.id,
        dependentId,
        facilityId: session.facilityId || null,
        facilityName,
        visitDate,
        status: "completed",
        copayPaid: copayPaid > 0,
        qrCode,
      });

      if (!visitResult.success) {
        console.error("Failed to persist visit:", visitResult.error);
        toast.error(visitResult.error || "Failed to save visit. Please try again.");
        return;
      }

      const usageResult = await recordPackageUsage(session.package.id, {
        personName: session.selectedMemberName,
        personInitials: session.selectedMemberName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        facilityName,
        visitDate,
        copayPaid,
      });

      if (!usageResult.success) {
        console.error("Failed to update package usage:", usageResult.error);
        toast.error(
          usageResult.error || "Failed to update package usage. Please refresh."
        );
        return;
      }

      recordUsage(session.package.id, {
        id: `usage-${Date.now()}`,
        userPackageId: session.package.id,
        personName: session.selectedMemberName,
        personInitials: session.selectedMemberName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        facilityName,
        visitDate,
        copayPaid,
      });
    };

    void persistVisit();
  }, [recordUsage, router, session]);

  const handleViewPackage = () => {
    const packageId = session?.packageId;
    resetRedemption();
    if (packageId) {
      router.push(`/my-packages/${packageId}`);
    } else {
      router.push("/my-packages");
    }
  };

  const handleBackToDashboard = () => {
    resetRedemption();
    router.push("/dashboard");
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  const packageCategory = session.package?.package?.category;
  const visitCount = session.package?.package?.visitCount;
  const memberName = session.selectedMemberName || "Your";
  const facilityName = session.facilityName || "Partner Facility";
  const remainingVisits = session.remainingVisits ?? 0;

  const formatCategory = (category?: string) => {
    if (!category) return "Package";
    return category
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string, timeString?: string) => {
    if (timeString) return timeString;
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-20 pb-10">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center text-center">
        <div className="text-[64px] leading-none">🤩</div>

        <h1 className="mt-6 text-xl font-bold text-neutral-900">
          Visit complete!
        </h1>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          {memberName}&apos;s visit at {facilityName}
        </p>

        <div className="mt-8 w-full rounded-[32px] border border-neutral-400 bg-white px-6 py-6">
          <div className="text-lg font-semibold text-neutral-900">
            {formatCategory(packageCategory)}
          </div>
          <div className="mt-1 text-base text-neutral-700">
            {visitCount ? `${visitCount} Visits Pack` : "Visits Pack"}
          </div>

          <div className="mt-6 border-t border-neutral-400 bg-neutral-200 px-5 py-4 text-left">
            <div className="flex items-center justify-between text-base text-neutral-700">
              <span className="font-semibold text-neutral-900">Date</span>
              <span>{formatDate(session.visitDate)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-base text-neutral-700">
              <span className="font-semibold text-neutral-900">Time</span>
              <span>{formatTime(session.visitDate, session.visitTime)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-base text-neutral-700">
              <span className="font-semibold text-neutral-900">Co-pay paid</span>
              <span>{formatCurrency(session.copayPaid)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-base text-neutral-700">
              <span className="font-semibold text-neutral-900">Remaining</span>
              <span>
                {visitCount ? `${remainingVisits} of ${visitCount} visits` : `${remainingVisits} visits`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm pt-8">
        <button
          onClick={handleViewPackage}
          className="mb-6 w-full text-center text-base font-semibold text-neutral-900"
        >
          View package details
        </button>

        <button
          onClick={handleBackToDashboard}
          className="h-12 w-full rounded-xl border-2 border-neutral-900 bg-primary-900 text-base font-bold text-neutral-900 transition-colors hover:bg-emerald-400"
        >
          Done
        </button>
      </div>
    </div>
  );
}
