"use client";

import { ChevronRight } from "lucide-react";
import type { ApprovalHistoryItem } from "@/types";
import { ApprovalStatus } from "@/types";
import { ApprovalStatusBadge } from "@/components/common/ApprovalStatusBadge";

interface ApprovalCardProps {
  approval: ApprovalHistoryItem;
  onPress?: () => void;
}

/**
 * Format date as "4 Jan 2025"
 */
function formatApprovalDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ApprovalCard({ approval, onPress }: ApprovalCardProps) {
  const Component = onPress ? "button" : "div";
  const isApproved = approval.status === ApprovalStatus.APPROVED;

  return (
    <Component
      onClick={onPress}
      className={`w-full rounded-4xl border border-neutral-400 bg-white p-4 ${
        onPress ? "text-left transition-colors hover:bg-neutral-50 cursor-pointer" : ""
      }`}
    >
      {/* Top section: Avatar + Name + Facility/Date */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: '#E3F1FC' }}
        >
          <span className="text-sm font-bold text-neutral-900">
            {approval.memberInitials}
          </span>
        </div>

        {/* Name and Facility */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-neutral-900 truncate">
            {approval.memberName}
          </h4>
          <p className="text-sm text-neutral-700 truncate">
            {approval.facilityName} · On: {formatApprovalDate(approval.requestDate)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 border-b border-neutral-400" />

      {/* Middle section: Package info + Time */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-neutral-900">
          <span className="font-semibold">{approval.packageCategory}</span>
          {' '}({approval.packageName})
        </p>
        <p className="text-sm text-neutral-700 shrink-0">
          At: {approval.requestTime}
        </p>
      </div>

      {/* Bottom section: Status badge + Copay + Chevron */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <ApprovalStatusBadge status={approval.status} />
          {isApproved && (
            <span className="text-sm text-neutral-700">
              Co-pay: UGX {approval.copay.toLocaleString()}
            </span>
          )}
        </div>

        {onPress && (
          <ChevronRight className="h-5 w-5 shrink-0 text-neutral-600" />
        )}
      </div>
    </Component>
  );
}
