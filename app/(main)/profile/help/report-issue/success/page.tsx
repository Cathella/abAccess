"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ReportIssueSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refNumber = searchParams.get("ref") || "#ISS-0000-00000";

  const handleDone = () => {
    router.push("/profile/help");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">🫣</span>

      <h1 className="text-xl font-bold text-gray-900 mb-2">Issue reported</h1>

      <p className="text-gray-500 text-center mb-4 px-4">
        Thanks for letting us know. We&apos;ll look into this and get back to
        you within 24 hours.
      </p>

      <p className="font-semibold text-gray-900">
        Reference NO.: {refNumber}
      </p>

      <div className="w-full max-w-sm mt-8">
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
