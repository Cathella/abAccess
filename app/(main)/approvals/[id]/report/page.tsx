"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { ApprovalDetailCard } from "@/components/cards/ApprovalDetailCard";
import { useAuth } from "@/hooks/useAuth";

interface ReportActivityPageProps {
  params: { id: string };
}

export default function ReportActivityPage({ params }: ReportActivityPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    getRequestById,
    reportSuspiciousActivity,
    loadPendingRequests,
    isLoading,
  } = usePendingApprovalsStore();
    usePendingApprovalsStore();
  const request = getRequestById(params.id);

  const [description, setDescription] = useState("");
  const [freezeAccount, setFreezeAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await reportSuspiciousActivity(params.id, description, freezeAccount);
      router.replace(`/approvals/${params.id}/reported?freeze=${freezeAccount}`);
    } catch {
      router.replace(`/approvals/${params.id}/error`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Report suspicious activity
        </h2>
        <p className="text-gray-600 mb-6">
          If you believe someone is trying to use your package without your
          permission, let us know.
        </p>

        <ApprovalDetailCard request={request} variant="declined" />

        <div className="mt-6">
          <label className="block font-medium text-gray-900 mb-2">
            What happened?
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what seems wrong..."
            className="w-full h-28 px-4 py-3 border border-gray-200 rounded-xl resize-none"
          />
          <p className="text-sm text-gray-400 mt-1">
            We&apos;ll review this within 24 hours.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <input
            type="checkbox"
            id="freezeAccount"
            checked={freezeAccount}
            onChange={(e) => setFreezeAccount(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <label htmlFor="freezeAccount" className="text-sm text-gray-700">
            Freeze my account until this is resolved
          </label>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-3">
        <button
          onClick={() => router.back()}
          className="w-full py-3 text-center font-semibold text-gray-900"
          type="button"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 bg-[#32C28A] rounded-xl font-semibold text-white disabled:opacity-50"
          type="button"
        >
          {isSubmitting ? "Submitting..." : "Submit report"}
        </button>
      </div>
    </div>
  );
}
