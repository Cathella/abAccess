"use client";

import { ChevronRight } from "lucide-react";
import type { VisitRecord } from "@/types";
import { VisitStatusBadge } from "@/components/common/VisitStatusBadge";
import { formatVisitDate, formatVisitTime } from "@/lib/utils";

interface VisitCardProps {
  visit: VisitRecord;
  onPress?: () => void;
}

export function VisitCard({ visit, onPress }: VisitCardProps) {
  const Component = onPress ? "button" : "div";
  const isCompleted = ['completed', 'remotely_approved'].includes(visit.status);
  const isCanceled = ['canceled', 'no_show'].includes(visit.status);

  // Format date and time using utility functions
  const formattedDate = formatVisitDate(visit.visitDate);
  const formattedTime = formatVisitTime(visit.visitTime);

  return (
    <Component
      onClick={onPress}
      className={`w-full rounded-2xl border border-neutral-400 bg-white p-4 ${
        onPress ? "text-left transition-colors hover:bg-neutral-50 cursor-pointer" : ""
      }`}
    >
      {/* Top section: Avatar + Name + Facility/Date */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100">
          <span className="text-sm font-bold text-neutral-900">
            {visit.memberInitials}
          </span>
        </div>

        {/* Name and Facility */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-neutral-900 truncate">
            {visit.memberName}
          </h4>
          <p className="text-sm text-neutral-700 truncate">
            {visit.facilityName} · {formattedDate}
          </p>
        </div>

        {/* Chevron (if clickable) */}
        {onPress && (
          <ChevronRight className="h-5 w-5 shrink-0 text-neutral-700" />
        )}
      </div>

      {/* Divider */}
      <div className="my-3 border-b border-neutral-400" />

      {/* Bottom section */}
      <div className="space-y-2">
        {/* Row 1: Package info + Time */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-neutral-900">
            <span style={{ color: '#1A1A1A' }}>{visit.packageCategory}</span>
            {' '}({visit.packageName})
          </p>
          <p className="text-sm text-neutral-700 shrink-0">
            {formattedTime}
          </p>
        </div>

        {/* Row 2: Status + Additional info */}
        <div className="flex items-center justify-between gap-2">
          <VisitStatusBadge status={visit.status} />

          {/* Additional info based on status */}
          <div className="text-sm text-neutral-700 shrink-0">
            {isCompleted && visit.copayAmount && (
              <span>Co-pay: UGX {visit.copayAmount.toLocaleString()}</span>
            )}
            {isCanceled && visit.refundNote && (
              <span className="text-neutral-700">{visit.refundNote}</span>
            )}
          </div>
        </div>
      </div>
    </Component>
  );
}
