"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { ApprovalDetailCard } from "@/components/cards/ApprovalDetailCard";
import { useAuth } from "@/hooks/useAuth";

interface ApprovalExpiredPageProps {
  params: { id: string };
}

export default function ApprovalExpiredPage({ params }: ApprovalExpiredPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getRequestById, removeRequest, loadPendingRequests } =
    usePendingApprovalsStore();
  const request = getRequestById(params.id);

  useEffect(() => {
    if (!request && user?.id) {
      loadPendingRequests(user.id);
    }
  }, [loadPendingRequests, request, user?.id]);

  if (!request) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-gray-500">Request not found</p>
      </div>
    );
  }

  const handleDone = () => {
    removeRequest(params.id);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">😩</span>

      <h1 className="text-xl font-bold text-gray-900 mb-2">
        Request expired
      </h1>
      <p className="text-gray-500 text-center mb-6">
        This approval request has timed out. The facility can submit a new
        request if needed.
      </p>

      <div className="w-full max-w-sm mb-4">
        <ApprovalDetailCard request={request} variant="expired" />
      </div>

      <p className="text-gray-400 text-sm mb-8">
        No visit was deducted from your package
      </p>

      <div className="w-full max-w-sm">
        <button
          onClick={handleDone}
          className="w-full py-3 bg-[#32C28A] border border-gray-900 rounded-xl font-semibold text-white"
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
