"use client";

import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { PendingApprovalRequest } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";

interface PendingRequestCardProps {
  request: PendingApprovalRequest;
  onTap: () => void;
}

export function PendingRequestCard({ request, onTap }: PendingRequestCardProps) {
  const { formattedTime, isExpired } = useCountdown(request.expiresAt);
  const { markAsExpired } = usePendingApprovalsStore();

  useEffect(() => {
    if (isExpired && request.status === "pending") {
      markAsExpired(request.id);
    }
  }, [isExpired, markAsExpired, request.id, request.status]);

  return (
    <button
      onClick={onTap}
      className="w-full bg-white rounded-2xl border border-gray-100 p-4 text-left"
      type="button"
    >
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#E3F1FC] flex items-center justify-center">
          <span className="text-base font-bold text-gray-900">
            {request.memberInitials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{request.memberName}</p>
          <p className="text-sm text-gray-500">{request.facilityName}</p>
        </div>
      </div>

      <div className="border-b border-gray-100 my-3" />

      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1.5 text-sm ${
            isExpired ? "text-red-600" : "bg-[#FEF3C7] text-gray-900"
          }`}
        >
          {isExpired ? "Expired" : `Expires in ${formattedTime}`}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </button>
  );
}
