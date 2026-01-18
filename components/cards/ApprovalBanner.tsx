"use client";

import { BellRing, ChevronRight } from "lucide-react";
import { PendingApprovalRequest } from "@/types";

interface ApprovalBannerProps {
  pendingCount: number;
  singleRequest?: PendingApprovalRequest;
  onTap: () => void;
}

export function ApprovalBanner({
  pendingCount,
  singleRequest,
  onTap,
}: ApprovalBannerProps) {
  const isSingle = pendingCount === 1 && singleRequest;
  const memberFirstName = singleRequest?.memberName.split(" ")[0] || "";

  return (
    <button
      onClick={onTap}
      className="w-full bg-[#FEF3C7] rounded-2xl p-4 text-left"
      type="button"
    >
      <div className="flex items-center gap-2 mb-2">
        <BellRing className="w-5 h-5 text-amber-700" />
        <span className="font-semibold text-gray-900">
          {isSingle ? "Approval needed" : `${pendingCount} approvals needed`}
        </span>
      </div>

      <div className="border-t border-amber-200/50 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-gray-700 text-sm pr-4">
            {isSingle
              ? `${singleRequest.facilityName} wants to use your package for ${memberFirstName}. Tap to review.`
              : "Tap to review pending requests."}
          </p>
          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
        </div>
      </div>
    </button>
  );
}
