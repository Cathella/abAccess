"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PinInput } from "@/components/forms/PinInput";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { useAuth } from "@/hooks/useAuth";

interface ApprovalPinPageProps {
  params: { id: string };
}

export default function ApprovalPinPage({ params }: ApprovalPinPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    getRequestById,
    setProcessingStatus,
    loadPendingRequests,
    isLoading,
  } = usePendingApprovalsStore();
    usePendingApprovalsStore();
  const request = getRequestById(params.id);

  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(3);

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

  const handlePinComplete = async (enteredPin: string) => {
    if (enteredPin === "1234") {
      setError(null);
      setProcessingStatus("verifying_pin");
      router.push(`/approvals/${params.id}/approving`);
      return;
    }

    const remaining = attempts - 1;
    setAttempts(remaining);
    setError(
      `Wrong PIN. ${remaining} attempt${remaining !== 1 ? "s" : ""} left`
    );
    setPin("");

    if (remaining <= 0) {
      router.push("/profile/security/forgot-pin");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter your PIN
        </h2>
        <p className="text-gray-600 mb-8">
          Confirm your identity to approve{" "}
          {request.memberName.split(" ")[0]}'s visit at{" "}
          {request.facilityName}.
        </p>

        <PinInput
          value={pin}
          onChange={setPin}
          onComplete={handlePinComplete}
          showPin={showPin}
          error={error || undefined}
        />

        <div className="flex items-center justify-center gap-2 mt-4">
          <input
            type="checkbox"
            id="showPin"
            checked={showPin}
            onChange={(event) => setShowPin(event.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="showPin" className="text-sm text-gray-500">
            Show PIN
          </label>
        </div>
      </div>

      <div className="px-4 pb-8">
        <button
          onClick={() => router.push("/profile/security/forgot-pin")}
          className="block w-full text-center text-blue-500 underline"
          type="button"
        >
          Forgot PIN?
        </button>
      </div>
    </div>
  );
}
