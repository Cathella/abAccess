"use client";

import { useRouter } from "next/navigation";
import { Grid3X3, Key, Info } from "lucide-react";
import ProfileMenuItem from "@/components/common/ProfileMenuItem";

export default function SecurityPage() {
  const router = useRouter();

  const handleChangePin = () => {
    router.push("/profile/security/change-pin");
  };

  const handleForgotPin = () => {
    router.push("/profile/security/forgot-pin");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 space-y-4">
        {/* Title Section */}
        <div className="px-1">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Keep your account safe
          </h2>
          <p className="text-base text-neutral-700">
            Your PIN protects your wallet and approves transactions. Keep it
            private.
          </p>
        </div>

        {/* Options Card */}
        <div className="bg-white rounded-4xl px-4 border border-neutral-400">
          {/* Change PIN */}
          <button
            onClick={handleChangePin}
            className="w-full flex items-center gap-3 py-4 border-b border-neutral-400 text-left"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center shrink-0">
              <Grid3X3 size={20} className="text-neutral-900" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-base font-medium text-neutral-900">
                Change PIN
              </span>
              <span className="block text-sm text-neutral-700 mt-0.5">
                Update your 4-digit security PIN
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-700 shrink-0"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Forgot PIN */}
          <button
            onClick={handleForgotPin}
            className="w-full flex items-center gap-3 py-4 text-left"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center shrink-0">
              <Key size={20} className="text-neutral-900" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-base font-medium text-neutral-900">
                Forgot PIN?
              </span>
              <span className="block text-sm text-neutral-700 mt-0.5">
                Reset your PIN using your phone
              </span>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-700 shrink-0"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Security Tips Card */}
        <div
          className="rounded-4xl p-4"
          style={{ backgroundColor: "#E3F1FC" }}
        >
          <div className="flex items-start gap-3">
            <Info size={24} className="text-neutral-900 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base font-medium text-neutral-900 mb-3">
                Security tips
              </p>
              <ul className="space-y-2 text-sm text-neutral-900">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-700 mt-1">•</span>
                  <span>Never share your PIN with anyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-700 mt-1">•</span>
                  <span>Avoid simple patterns like 1234 or 0000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-700 mt-1">•</span>
                  <span>Change your PIN if you suspect it&apos;s been compromised</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
