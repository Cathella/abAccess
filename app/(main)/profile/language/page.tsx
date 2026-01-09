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
    <div className="min-h-screen bg-neutral-200">
      <div className="px-4 py-6 space-y-4">
        {/* Title Section */}
        <div className="px-1">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Select your language
          </h2>
          <p className="text-base text-neutral-600">
            Choose the language you&apos;d like to use throughout the app.
          </p>
        </div>

        {/* Language Options Card */}
        <div className="bg-white rounded-2xl px-4">
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
                  !isLast && "border-b border-neutral-300",
                  !option.available && "cursor-not-allowed"
                )}
              >
                {/* Radio Dot */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
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
                    option.available ? "text-neutral-900" : "text-neutral-600"
                  )}
                >
                  {option.name}
                </span>

                {/* Right Side: Checkmark or Coming Soon Badge */}
                {option.available ? (
                  isSelected && (
                    <Check
                      size={20}
                      className="text-primary-900 flex-shrink-0"
                    />
                  )
                ) : (
                  <span className="bg-neutral-800 text-white text-xs rounded-full px-2 py-1 flex-shrink-0">
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
            <Info size={20} className="text-secondary-900 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base font-medium text-neutral-900 mb-1">
                More languages coming
              </p>
              <p className="text-sm text-neutral-700 mb-3">
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
