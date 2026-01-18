"use client";

import { useRouter } from "next/navigation";
import { Check, Info, ChevronRight } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { LANGUAGE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LanguageCode } from "@/types";

export default function LanguagePage() {
  const router = useRouter();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const handleSelectLanguage = (code: LanguageCode, available: boolean) => {
    if (available) {
      setLanguage(code);
    }
  };

  const handleRequestLanguage = () => {
    // Could open email client or navigate to feedback page
    if (typeof window !== "undefined" && window.location) {
      window.location.href =
        "mailto:support@abaaccess.com?subject=Language Request";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 space-y-4">
        {/* Title Section */}
        <div className="px-1">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Select your language
          </h2>
          <p className="text-base text-neutral-700">
            Choose the language you&apos;d like to use throughout the app.
          </p>
        </div>

        {/* Language Options Card */}
        <div className="bg-white rounded-4xl px-4 border border-neutral-400">
          {LANGUAGE_OPTIONS.map((option, index) => {
            const isSelected = language === option.code;
            const isLast = index === LANGUAGE_OPTIONS.length - 1;

            return (
              <button
                key={option.code}
                onClick={() =>
                  handleSelectLanguage(option.code, option.available)
                }
                disabled={!option.available}
                className={cn(
                  "w-full flex items-center gap-3 py-4 text-left",
                  !isLast && "border-b border-neutral-400",
                  !option.available && "cursor-not-allowed"
                )}
              >
                {/* Radio Dot */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    isSelected && option.available
                      ? "border-secondary-900"
                      : "border-neutral-500"
                  )}
                >
                  {isSelected && option.available && (
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary-900" />
                  )}
                </div>

                {/* Language Name */}
                <span
                  className={cn(
                    "flex-1 text-base font-medium",
                    option.available ? "text-neutral-900" : "text-neutral-700"
                  )}
                >
                  {option.name}
                </span>

                {/* Right Side: Checkmark or Coming Soon Badge */}
                {option.available ? (
                  isSelected && (
                    <Check
                      size={20}
                      className="text-primary-900 shrink-0"
                    />
                  )
                ) : (
                  <span className="bg-secondary-100 text-neutral-900 text-sm rounded-full px-2 py-1 shrink-0">
                    Coming soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Info Card */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#E3F1FC" }}
        >
          <div className="flex items-start gap-3">
            <Info size={24} className="text-neutral-900 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base font-medium text-neutral-900 mb-1">
                More languages coming
              </p>
              <p className="text-sm text-neutral-900 mb-3">
                We&apos;re working on adding more languages. Let us know which
                language you&apos;d like to see next!
              </p>
              <button
                onClick={handleRequestLanguage}
                className="flex items-center gap-1 text-sm font-medium text-secondary-900"
              >
                Request a language
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
