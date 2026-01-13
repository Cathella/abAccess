"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { Loader2 } from "lucide-react";

interface ApprovingPageProps {
  params: { id: string };
}

export default function ApprovingPage({ params }: ApprovingPageProps) {
  const router = useRouter();
  const { approveRequest } = usePendingApprovalsStore();

  useEffect(() => {
    const processApproval = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await approveRequest(params.id);
        router.replace(`/approvals/${params.id}/success`);
      } catch (error) {
        if (error instanceof Error && error.message === "PACKAGE_EXPIRED") {
          router.replace(`/approvals/${params.id}/cancelled`);
          return;
        }
        if (error instanceof Error && error.message.startsWith("REQUEST_")) {
          const status = error.message.replace("REQUEST_", "").toLowerCase();
          if (status === "approved") {
            router.replace(`/approvals/${params.id}/success`);
            return;
          }
          if (status === "declined") {
            router.replace(`/approvals/${params.id}/declined`);
            return;
          }
          if (status === "expired") {
            router.replace(`/approvals/${params.id}/expired`);
            return;
          }
        }
        router.replace(`/approvals/${params.id}/error`);
      }
    };

    processApproval();
  }, [params.id, approveRequest, router]);

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
