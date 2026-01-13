"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApprovalDetailCard } from "@/components/cards/ApprovalDetailCard";
import { useCountdown } from "@/hooks/useCountdown";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ApproveVisitPageProps {
  params: { id: string };
}

export default function ApproveVisitPage({ params }: ApproveVisitPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    getRequestById,
    loadPendingRequests,
    markAsExpired,
    processingStatus,
    isLoading,
  } = usePendingApprovalsStore();
    usePendingApprovalsStore();
  const request = getRequestById(params.id);

  const { formattedTime, isExpired } = useCountdown(
    request?.expiresAt || new Date().toISOString()
  );

  useEffect(() => {
    if (!request && user?.id) {
      loadPendingRequests(user.id);
    }
  }, [loadPendingRequests, request, user?.id]);

  useEffect(() => {
    if (!request) return;
    if (request.status === "approved") {
      router.replace(`/approvals/${params.id}/success`);
    } else if (request.status === "declined") {
      router.replace(`/approvals/${params.id}/declined`);
    } else if (request.status === "expired") {
      router.replace(`/approvals/${params.id}/expired`);
    } else if (request.status === "cancelled") {
      router.replace(`/approvals/${params.id}/cancelled`);
    }
  }, [params.id, request, router]);

  useEffect(() => {
    if (request && isExpired) {
      markAsExpired(request.id);
      router.replace(`/approvals/${params.id}/expired`);
    }
  }, [isExpired, markAsExpired, params.id, request, router]);

  if (!request && isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-gray-500">Loading request...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-gray-500">Request not found</p>
      </div>
    );
  }

  const handleApprove = () => {
    router.push(`/approvals/${params.id}/pin`);
  };

  const handleDecline = () => {
    router.push(`/approvals/${params.id}/decline`);
  };

  const handleReport = () => {
    router.push(`/approvals/${params.id}/report`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Approve this visit?
        </h2>
        <p className="text-gray-600 mb-6">
          {request.facilityName} is requesting to use your package for a visit.
        </p>

        <ApprovalDetailCard request={request} variant="pending" />

        <div className="flex items-center justify-center gap-2 mt-6">
          <Clock className="w-4 h-4 text-red-500" />
          <span className="text-red-500 text-sm">
            Expires in {formattedTime} minutes
          </span>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-3">
        <button
          onClick={handleReport}
          className="w-full py-3 text-center font-semibold text-red-500"
          type="button"
          disabled={processingStatus !== "idle"}
        >
          Report suspicious activity
        </button>

        <button
          onClick={handleDecline}
          className="w-full py-3 bg-[#FEE2E2] border border-gray-900 rounded-xl font-semibold text-gray-900"
          type="button"
          disabled={processingStatus !== "idle"}
        >
          Decline
        </button>

        <button
          onClick={handleApprove}
          className="w-full py-3 bg-[#32C28A] rounded-xl font-semibold text-white"
          type="button"
          disabled={processingStatus !== "idle"}
        >
          Approve visit
        </button>
      </div>
    </div>
  );
}
