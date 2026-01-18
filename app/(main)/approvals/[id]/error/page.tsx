"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { ApprovalDetailCard } from "@/components/cards/ApprovalDetailCard";
import { useCountdown } from "@/hooks/useCountdown";
import { useAuth } from "@/hooks/useAuth";

export default function ApprovalErrorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const approvalId = params.id;
  const { user } = useAuth();
  const { getRequestById, loadPendingRequests } = usePendingApprovalsStore();
  const request = approvalId ? getRequestById(approvalId) : undefined;

  const { formattedTime, isExpired } = useCountdown(
    request?.expiresAt || new Date().toISOString()
  );

  useEffect(() => {
    if (!request && user?.id) {
      loadPendingRequests(user.id);
    }
  }, [loadPendingRequests, request, user?.id]);

  useEffect(() => {
    if (request && isExpired && approvalId) {
      router.replace(`/approvals/${approvalId}/expired`);
    }
  }, [approvalId, isExpired, request, router]);

  if (!approvalId || !request) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-gray-500">Request not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">🤔</span>

      <h1 className="text-xl font-bold text-gray-900 mb-2">
        Connection error
      </h1>
      <p className="text-gray-500 text-center mb-6">
        We couldn&apos;t process your response. Check your internet and try
        again.
      </p>

      <div className="w-full max-w-sm mb-4">
        <ApprovalDetailCard request={request} variant="pending" />
      </div>

      <p className="text-red-500 text-sm mb-8">
        Request expires in {formattedTime}
      </p>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => router.push(`/approvals/${approvalId}`)}
          className="w-full py-3 text-center font-semibold text-gray-900"
          type="button"
        >
          Cancel
        </button>

        <button
          onClick={() => router.push(`/approvals/${approvalId}/approving`)}
          className="w-full py-3 bg-primary-900 border border-gray-900 rounded-xl font-semibold text-white"
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
