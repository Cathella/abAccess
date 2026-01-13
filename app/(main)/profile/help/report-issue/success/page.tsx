"use client";

import { useRouter } from "next/navigation";
import { ResultScreen } from "@/components/common/ResultScreen";

export default function ReportIssueSuccessPage() {
  const router = useRouter();

  return (
    <ResultScreen
      emoji="✅"
      title="Report submitted"
      subtitle="Thank you for letting us know. Our team will review your issue and get back to you within 24-48 hours."
      primaryAction={{
        label: "Back to Help",
        onPress: () => router.push("/profile/help"),
      }}
      secondaryAction={{
        label: "Go to Dashboard",
        onPress: () => router.push("/dashboard"),
      }}
    />
  );
}
