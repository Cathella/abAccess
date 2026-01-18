"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { Loader2 } from "lucide-react";

export default function ApprovingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const approvalId = params.id;
  const { approveRequest } = usePendingApprovalsStore();

  useEffect(() => {
    if (!approvalId) return;
    const processApproval = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await approveRequest(approvalId);
        router.replace(`/approvals/${approvalId}/success`);
      } catch (error) {
        if (error instanceof Error && error.message === "PACKAGE_EXPIRED") {
          router.replace(`/approvals/${approvalId}/cancelled`);
          return;
        }
        if (error instanceof Error && error.message.startsWith("REQUEST_")) {
          const status = error.message.replace("REQUEST_", "").toLowerCase();
          if (status === "approved") {
            router.replace(`/approvals/${approvalId}/success`);
            return;
          }
          if (status === "declined") {
            router.replace(`/approvals/${approvalId}/declined`);
            return;
          }
          if (status === "expired") {
            router.replace(`/approvals/${approvalId}/expired`);
            return;
          }
        }
        router.replace(`/approvals/${approvalId}/error`);
      }
    };

    processApproval();
  }, [approvalId, approveRequest, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Loader2 className="w-16 h-16 text-[#3A8DFF] animate-spin mb-4" />
      <h1 className="text-xl font-bold text-gray-900 mb-2">
        Approving visit...
      </h1>
      <p className="text-gray-500">Please don&apos;t close the app.</p>
    </div>
  );
}
