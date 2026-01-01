"use client";

import { ChevronRight } from "lucide-react";
import type { VisitRecord } from "@/types";
import { VisitStatusBadge } from "@/components/common/VisitStatusBadge";

interface VisitCardProps {
  visit: VisitRecord;
  onPress?: () => void;
}

/**
 * Format visit date according to specifications:
 * - Tomorrow: "Tomorrow"
 * - Within 7 days: "Fri, 10 Jan"
 * - Completed: "On: 4 Jan 2025"
 * - Otherwise: "On: 4 Jan 2025"
 */
function formatVisitDate(dateString: string, isCompleted: boolean): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const visitDate = new Date(date);
  visitDate.setHours(0, 0, 0, 0);

  // For completed visits, always show full date
  if (isCompleted) {
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `On: ${day} ${month} ${year}`;
  }

  // Check if tomorrow
  if (visitDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }

  // Check if within 7 days
  const diffTime = visitDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0 && diffDays <= 7) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    return `${dayName}, ${day} ${month}`;
  }

  // Default format
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `On: ${day} ${month} ${year}`;
}

export function VisitCard({ visit, onPress }: VisitCardProps) {
  const Component = onPress ? "button" : "div";
  const isCompleted = ['completed', 'remotely_approved'].includes(visit.status);
  const isCanceled = ['canceled', 'no_show'].includes(visit.status);

  // Format date based on status
  const formattedDate = formatVisitDate(visit.visitDate, isCompleted || isCanceled);

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
          <h4 className="font-semibold text-gray-900">
            {visit.memberName}
          </h4>
          <p className="text-sm text-gray-500">
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
            At: {visit.visitTime}
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
