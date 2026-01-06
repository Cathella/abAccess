"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";
import { useVisitsStore } from "@/stores/visitsStore";

function formatTitleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function VisitDetailsPage() {
  const router = useRouter();
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

  const packageCategory = formatTitleCase(visit.packageCategory || "Package");
  const statusLabel = visit.status === "completed" ? "Completed" : formatTitleCase(visit.status);
  const copayValue = visit.copayAmount ?? 0;
  const providerNotes = visit.refundNote || "No provider notes were recorded for this visit.";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Visit details" showBack />

      <div className="flex-1 px-6 pb-32 pt-6">
        <div className="rounded-4xl border border-neutral-400 bg-white p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-neutral-900">{packageCategory}</h2>
            <p className="mt-1 text-sm text-neutral-700">{visit.packageName}</p>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5">
              <Check className="h-5 w-5 text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">{statusLabel}</span>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-neutral-100 px-6 py-6">
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <span className="font-semibold text-neutral-900">Patient</span>
              <span className="text-neutral-900">{visit.memberName}</span>

              <span className="font-semibold text-neutral-900">Facility</span>
              <span className="text-neutral-900">{visit.facilityName}</span>

              <span className="font-semibold text-neutral-900">Date</span>
              <span className="text-neutral-900">{formatDate(visit.visitDate)}</span>

              <span className="font-semibold text-neutral-900">Time</span>
              <span className="text-neutral-900">{visit.visitTime}</span>

              <span className="font-semibold text-neutral-900">Co-pay paid</span>
              <span className="text-neutral-900">UGX {copayValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-4xl bg-secondary-100 px-6 py-5">
          <h3 className="text-base font-bold text-neutral-900">Provider notes</h3>
          <div className="mt-3 h-px bg-neutral-400/60" />
          <p className="mt-4 text-sm leading-[160%] text-neutral-900">{providerNotes}</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-4">
        <button
          type="button"
          className="mb-3 w-full text-center text-base font-semibold text-error-900"
          onClick={() => window.location.assign("mailto:support@abaccess.com")}
        >
          Report an issue
        </button>
        <button
          type="button"
          onClick={() => router.push(`/visits/${visit.id}/receipt`)}
          className="w-full rounded-xl border-[1.5px] border-neutral-900 bg-primary-900 h-12 text-base font-bold text-neutral-900 transition-colors hover:bg-primary-800"
        >
          Download receipt
        </button>
      </div>
    </div>
  );
}
