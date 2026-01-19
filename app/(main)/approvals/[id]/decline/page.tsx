"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { DECLINE_REASON_OPTIONS } from "@/lib/constants";
import { DeclineReason } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function DeclineReasonPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const approvalId = params.id;
  const { user } = useAuth();
  const { declineRequest, getRequestById, loadPendingRequests, isLoading } =
    usePendingApprovalsStore();
  const request = approvalId ? getRequestById(approvalId) : undefined;

  const [selectedReason, setSelectedReason] = useState<DeclineReason | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDecline = async () => {
    if (!selectedReason || !approvalId) return;

    setIsSubmitting(true);
    try {
      await declineRequest(
        approvalId,
        selectedReason,
        selectedReason === "other" ? otherReason : undefined
      );
      router.replace(`/approvals/${approvalId}/declined`);
    } catch {
      router.replace(`/approvals/${approvalId}/error`);
    }
  };

  const handleReport = () => {
    if (!approvalId) return;
    router.push(`/approvals/${approvalId}/report`);
  };

  useEffect(() => {
    if (!request && user?.id) {
      loadPendingRequests(user.id);
    }
  }, [loadPendingRequests, request, user?.id]);

  useEffect(() => {
    if (!request || !approvalId) return;
    if (request.status === "approved") {
      router.replace(`/approvals/${approvalId}/success`);
    } else if (request.status === "declined") {
      router.replace(`/approvals/${approvalId}/declined`);
    } else if (request.status === "expired") {
      router.replace(`/approvals/${approvalId}/expired`);
    } else if (request.status === "cancelled") {
      router.replace(`/approvals/${approvalId}/cancelled`);
    }
  }, [approvalId, request, router]);

  if (!request && isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-gray-500">Loading request...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Why are you declining?
        </h2>
        <p className="text-gray-600 mb-6">
          Let us know so we can keep your account safe.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100">
          {DECLINE_REASON_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              onClick={() => setSelectedReason(option.value)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 text-left",
                index < DECLINE_REASON_OPTIONS.length - 1 &&
                  "border-b border-gray-100"
              )}
              type="button"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedReason === option.value
                    ? "border-[#3A8DFF]"
                    : "border-gray-300"
                )}
              >
                {selectedReason === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3A8DFF]" />
                )}
              </div>
              <span className="text-base text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>

        {selectedReason === "other" && (
          <textarea
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="Tell us more (optional)"
            className="w-full mt-4 h-24 px-4 py-3 border border-gray-200 rounded-xl resize-none"
          />
        )}
      </div>

      <div className="px-4 pb-8 space-y-3">
        <button
          onClick={handleReport}
          className="w-full py-3 text-center font-semibold text-gray-900"
          type="button"
        >
          Report Suspicious Activity
        </button>

        <button
          onClick={handleDecline}
          disabled={!selectedReason || isSubmitting}
          className="w-full py-3 bg-[#FEE2E2] border border-gray-900 rounded-xl font-semibold text-gray-900 disabled:opacity-50"
          type="button"
        >
          {isSubmitting ? "Declining..." : "Decline visit"}
        </button>
      </div>
    </div>
  );
}
