"use client";

import type { PackageUsage } from "@/types";
import { formatPackageDate } from "@/lib/packages";

interface UsageHistoryCardProps {
  usage: PackageUsage;
  onPress?: () => void;
}

export function UsageHistoryCard({ usage, onPress }: UsageHistoryCardProps) {
  const Component = onPress ? "button" : "div";

  return (
    <Component
      onClick={onPress}
      className={`w-full rounded-2xl border border-neutral-400 bg-white p-4 ${
        onPress ? "text-left transition-colors hover:bg-neutral-50 cursor-pointer" : ""
      }`}
    >
      {/* Avatar + Name + Facility */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100">
          <span className="text-sm font-semibold text-secondary-900">
            {usage.personInitials}
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-neutral-900">
            {usage.personName}
          </h4>
          <p className="text-sm text-neutral-600">{usage.facilityName}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-neutral-200" />

      {/* Visit Details */}
      <div className="space-y-1">
        <p className="text-sm text-neutral-600">
          Visited on: {formatPackageDate(usage.visitDate)}
        </p>
        <p className="text-sm text-neutral-600">
          Co-paid: UGX {usage.copayPaid.toLocaleString()}
        </p>
      </div>
    </Component>
  );
}
