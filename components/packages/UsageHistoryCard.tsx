"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { PackageUsage } from "@/types";
import { formatPackageDate } from "@/lib/packages";

interface UsageHistoryCardProps {
  packageId: string;
  usageHistory: PackageUsage[];
}

export function UsageHistoryCard({ packageId, usageHistory }: UsageHistoryCardProps) {
  const router = useRouter();

  if (usageHistory.length === 0) {
    return null;
  }

  // Get most recent visit
  const mostRecentVisit = usageHistory[0];
  const hasMoreVisits = usageHistory.length > 1;

  return (
    <div>
      {/* Usage Card */}
      <div className="rounded-2xl border border-neutral-400 bg-white p-4">
        {/* Visit Row */}
        <button
          onClick={() => router.push(`/visits/${mostRecentVisit.id}`)}
          className="flex w-full items-end gap-3 text-left transition-colors hover:bg-neutral-50 p-2 -m-2 rounded-xl"
        >
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100">
            <span className="text-sm font-semibold text-neutral-900">
              {mostRecentVisit.personInitials}
            </span>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-neutral-900">
              {mostRecentVisit.personName}
            </h4>
            <p className="text-sm text-neutral-700">
              {mostRecentVisit.facilityName}
            </p>
          </div>

          {/* Chevron */}
          <ChevronRight className="h-5 w-5 shrink-0 text-neutral-900" />
        </button>

        {/* Divider */}
        <div className="my-3 h-px bg-neutral-400" />

        {/* Bottom Info */}
        <div className="flex items-center gap-1.5 text-sm text-neutral-700">
          <span>Visited on: {formatPackageDate(mostRecentVisit.visitDate)}</span>
          <span>·</span>
          <span>Co-paid: {mostRecentVisit.copayPaid.toLocaleString()}</span>
        </div>
      </div>

      {/* More Visits Row */}
      {hasMoreVisits && (
        <button
          onClick={() => router.push(`/my-packages/${packageId}/history`)}
          className="mt-3 flex w-full items-center justify-between rounded-xl bg-secondary-100 px-4 py-3.5 transition-colors hover:bg-secondary-200"
        >
          <span className="text-base font-medium text-secondary-900">
            + {usageHistory.length - 1} more {usageHistory.length - 1 === 1 ? 'visit' : 'visits'}
          </span>
          <ChevronRight className="h-5 w-5 text-neutral-900" />
        </button>
      )}
    </div>
  );
}
