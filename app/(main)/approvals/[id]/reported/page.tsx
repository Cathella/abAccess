"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { AlertTriangle } from "lucide-react";

interface ReportSubmittedPageProps {
  params: { id: string };
}

export default function ReportSubmittedPage({ params }: ReportSubmittedPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFrozen = searchParams.get("freeze") === "true";
  const { removeRequest } = usePendingApprovalsStore();

  const handleDone = () => {
    removeRequest(params.id);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">😊</span>

      <h1 className="text-xl font-bold text-gray-900 mb-2">
        Report submitted
      </h1>
      <p className="text-gray-500 text-center mb-6">
        Thanks for letting us know. We&apos;ll review
      </p>

      {isFrozen && (
        <div className="w-full max-w-sm bg-[#FEF3C7] rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            <span className="font-semibold text-gray-900">Account frozen</span>
          </div>
          <div className="border-t border-amber-200/50 pt-2">
            <p className="text-sm text-gray-700">
              Your account has been temporarily frozen. You won&apos;t be able
              to use packages until we resolve this.
            </p>
          </div>
        </div>
      )}

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
