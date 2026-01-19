"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { ApprovalDetailCard } from "@/components/cards/ApprovalDetailCard";
import { useAuth } from "@/hooks/useAuth";

export default function ApprovalSuccessPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const approvalId = params.id;
  const { user } = useAuth();
  const { getRequestById, removeRequest, loadPendingRequests } =
    usePendingApprovalsStore();
  const request = approvalId ? getRequestById(approvalId) : undefined;

  useEffect(() => {
    if (!request && user?.id) {
      loadPendingRequests(user.id);
    }
  }, [loadPendingRequests, request, user?.id]);

  if (!approvalId || !request) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-gray-500">Request not found</p>
      </div>
    );
  }

  const handleViewPackage = () => {
    router.push(`/my-packages/${request.packageId}`);
  };

  const handleDone = () => {
    removeRequest(approvalId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">🥰</span>

      <h1 className="text-xl font-bold text-gray-900 mb-2">Visit approved!</h1>
      <p className="text-gray-500 text-center mb-6">
        {request.memberName.split(" ")[0]}&apos;s visit at {request.facilityName} has
        been approved.
      </p>

      <div className="w-full max-w-sm mb-4">
        <ApprovalDetailCard request={request} variant="approved" />
      </div>

      <p className="text-gray-400 text-sm mb-8">
        The co-pay will be collected at the facility.
      </p>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleViewPackage}
          className="w-full py-3 text-center font-semibold text-gray-900"
          type="button"
        >
          View package details
        </button>

        <button
          onClick={handleDone}
          className="w-full py-3 bg-primary-900 border border-gray-900 rounded-xl font-semibold text-white"
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
