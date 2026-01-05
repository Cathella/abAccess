"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultScreen } from "@/components/common/ResultScreen";
import { useRedemptionStore } from "@/stores/redemptionStore";
import { usePackageStore } from "@/stores/packageStore";

export default function RedemptionSuccessPage() {
  const router = useRouter();
  const { session, resetRedemption } = useRedemptionStore();
  const { recordUsage } = usePackageStore();

  useEffect(() => {
    // Redirect if no session
    if (!session) {
      router.push("/my-packages");
      return;
    }

    // Record the package usage
    if (session.package && session.selectedMemberId && session.selectedMemberName) {
      recordUsage(session.package.id, {
        id: `usage-${Date.now()}`,
        userPackageId: session.package.id,
        personName: session.selectedMemberName,
        personInitials: session.selectedMemberName
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase(),
        facilityName: session.facilityName || "Partner Facility",
        visitDate: session.visitDate || new Date().toISOString(),
        copayPaid: session.copayPaid || session.package.package.copay,
      });
    }
  }, [session, recordUsage]);

  const handleViewPackage = () => {
    const packageId = session?.packageId;
    resetRedemption();
    if (packageId) {
      router.push(`/my-packages/${packageId}`);
    } else {
      router.push("/my-packages");
    }
  };

  const handleBackToDashboard = () => {
    resetRedemption();
    router.push("/dashboard");
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <ResultScreen
      emoji="✅"
      title="Visit redeemed!"
      subtitle={`Your visit has been successfully redeemed. You have ${session.remainingVisits || 0} visits remaining in this package.`}
      primaryAction={{
        label: "View package",
        onPress: handleViewPackage,
      }}
      secondaryAction={{
        label: "Back to dashboard",
        onPress: handleBackToDashboard,
      }}
    />
  );
}
