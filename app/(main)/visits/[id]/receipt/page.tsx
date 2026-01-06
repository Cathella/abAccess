"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";
import { useVisitsStore } from "@/stores/visitsStore";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTitleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function VisitReceiptPage() {
  const params = useParams();
  const visitId = params.id as string;
  const { user } = useAuth();

  const visits = useVisitsStore((state) => state.visits);
  const loadVisits = useVisitsStore((state) => state.loadVisits);

  const visit = useMemo(
    () => visits.find((item) => item.id === visitId),
    [visitId, visits]
  );

  useEffect(() => {
    if (!visit && user?.id) {
      loadVisits(user.id, { force: true });
    }
  }, [loadVisits, user?.id, visit]);

  if (!visit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  const receiptNumber = `ABA-${new Date(visit.visitDate).getFullYear()}-${visit.id.slice(0, 5).toUpperCase()}`;
  const memberId = visit.isSelf ? user?.memberId || "N/A" : "Dependent";
  const packageCategory = formatTitleCase(visit.packageCategory || "Package");
  const packageLabel = `${packageCategory} - ${visit.packageName}`;
  const copayValue = visit.copayAmount ?? 0;
  const visitType = visit.packageCategory?.includes("consultation")
    ? "General consultation"
    : formatTitleCase(visit.packageCategory || "Visit");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Receipt" showBack />

      <div className="flex-1 px-6 pb-32 pt-6">
        <div className="rounded-4xl border border-neutral-400 bg-white p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold text-secondary-900">abAccess</div>
            <p className="text-sm text-neutral-600 tracking-[0.16em]">VISIT RECEIPT</p>
          </div>

          <div className="mt-6 h-px border-b border-dashed border-neutral-300" />

          <div className="mt-6 space-y-5 text-sm text-neutral-900">
            <div className="grid grid-cols-2 gap-y-4">
              <span className="font-semibold">Receipt #</span>
              <span className="text-right">{receiptNumber}</span>
              <span className="font-semibold">Date</span>
              <span className="text-right">{formatDate(visit.visitDate)}</span>
              <span className="font-semibold">Time</span>
              <span className="text-right">{visit.visitTime}</span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">Patient details</p>
              <div className="mt-3 h-px border-b border-dashed border-neutral-300" />
              <div className="mt-4 grid grid-cols-2 gap-y-4">
                <span className="font-semibold">Name</span>
                <span className="text-right">{visit.memberName}</span>
                <span className="font-semibold">Member ID</span>
                <span className="text-right">{memberId}</span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">Facility</p>
              <div className="mt-3 h-px border-b border-dashed border-neutral-300" />
              <div className="mt-4 grid grid-cols-2 gap-y-4">
                <span className="font-semibold">Name</span>
                <span className="text-right">{visit.facilityName}</span>
                <span className="font-semibold">Address</span>
                <span className="text-right">{visit.facilityAddress || "Address not available"}</span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">Visit details</p>
              <div className="mt-3 h-px border-b border-dashed border-neutral-300" />
              <div className="mt-4 grid grid-cols-2 gap-y-4">
                <span className="font-semibold">Type</span>
                <span className="text-right">{visitType}</span>
                <span className="font-semibold">Package</span>
                <span className="text-right">{packageLabel}</span>
                <span className="font-semibold">Co-pay paid</span>
                <span className="text-right">UGX {copayValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-primary-700 bg-primary-100 px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-900">
              <Check className="h-5 w-5" />
              VERIFIED VISIT
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full rounded-xl border-[1.5px] border-neutral-900 bg-primary-900 h-12 text-base font-bold text-neutral-900 transition-colors hover:bg-primary-800"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
