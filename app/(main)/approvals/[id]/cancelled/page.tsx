"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { ApprovalDetailCard } from "@/components/cards/ApprovalDetailCard";
import { useAuth } from "@/hooks/useAuth";

interface ApprovalCancelledPageProps {
  params: { id: string };
}

export default function ApprovalCancelledPage({
  params,
}: ApprovalCancelledPageProps) {
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

  const handleBrowsePackages = () => {
    router.push("/packages");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">🚫</span>

      <h1 className="text-xl font-bold text-gray-900 mb-2">
        Request cancelled
      </h1>
      <p className="text-gray-500 text-center mb-6">
        This request was automatically cancelled because the package has
        expired.
      </p>

      <div className="w-full max-w-sm mb-8">
        <ApprovalDetailCard request={request} variant="expired" />
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleDone}
          className="w-full py-3 text-center font-semibold text-gray-900"
          type="button"
        >
          Done
        </button>

        <button
          onClick={handleBrowsePackages}
          className="w-full py-3 bg-[#32C28A] border border-gray-900 rounded-xl font-semibold text-white"
          type="button"
        >
          Browse packages
        </button>
      </div>
    </div>
  );
}
