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
      className={`w-full rounded-2xl border border-gray-100 bg-white p-4 ${
        onPress ? "text-left transition-colors hover:bg-neutral-50 cursor-pointer" : ""
      }`}
    >
      {/* Top section: Avatar + Name + Facility/Date */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E3F1FC]">
          <span className="text-sm font-semibold text-[#3A8DFF]">
            {visit.memberInitials}
          </span>
        </div>

        {/* Name and Facility */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {visit.memberName}
          </h4>
          <p className="text-sm text-gray-500 truncate">
            {visit.facilityName} · {formattedDate}
          </p>
        </div>

        {/* Chevron (if clickable) */}
        {onPress && (
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
        )}
      </div>

      {/* Divider */}
      <div className="my-3 border-b border-gray-100" />

      {/* Bottom section */}
      <div className="space-y-2">
        {/* Row 1: Package info + Time */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-gray-900">
            <span style={{ color: '#32C28A' }}>{visit.packageCategory}</span>
            {' '}({visit.packageName})
          </p>
          <p className="text-sm text-gray-500 shrink-0">
            {formattedTime}
          </p>
        </div>

        {/* Row 2: Status + Additional info */}
        <div className="flex items-center justify-between gap-2">
          <VisitStatusBadge status={visit.status} />

          {/* Additional info based on status */}
          <div className="text-sm text-gray-500 shrink-0">
            {isCompleted && visit.copayAmount && (
              <span>Co-pay: UGX {visit.copayAmount.toLocaleString()}</span>
            )}
            {isCanceled && visit.refundNote && (
              <span className="text-gray-400">{visit.refundNote}</span>
            )}
          </div>
        </div>
      </div>
    </Component>
  );
}
