"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { PendingRequestCard } from "@/components/cards/PendingRequestCard";
import { useAuth } from "@/hooks/useAuth";

export default function PendingApprovalsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { pendingRequests, isLoading, loadPendingRequests } = usePendingApprovalsStore();

  const pending = pendingRequests.filter((request) => request.status === "pending");

  useEffect(() => {
    if (!user?.id) return;
    loadPendingRequests(user.id);
  }, [loadPendingRequests, user?.id]);

  const handleRequestTap = (id: string) => {
    router.push(`/approvals/${id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-4">
        <p className="text-gray-600 mb-4">
          Review and respond to these requests before they expire.
        </p>

        <div className="space-y-3">
          {pending.map((request) => (
            <PendingRequestCard
              key={request.id}
              request={request}
              onTap={() => handleRequestTap(request.id)}
            />
          ))}
        </div>

        {!isLoading && pending.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No pending approval requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
