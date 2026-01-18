"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FAQItem } from "@/types";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
  onFeedback?: (helpful: boolean) => void;
}

export function FAQAccordion({
  faq,
  isExpanded,
  onToggle,
  onFeedback,
}: FAQAccordionProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    onFeedback?.(helpful);
  };

  return (
    <div className="border-b border-neutral-400">
      <button
        onClick={onToggle}
        className={cn("w-full flex items-center justify-between py-4")}
      >
        <span className="text-base text-gray-900 text-left pr-4">
          {faq.question}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-neutral-600 shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-neutral-700 shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="pb-4">
          <div className="bg-secondary-100 rounded-xl p-4">
            <p className="text-sm text-neutral-900 whitespace-pre-line">
              {faq.answer}
            </p>
          </div>

          {!feedbackGiven && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-base text-neutral-600">Was this helpful?</span>
              <button
                onClick={() => handleFeedback(true)}
                className="text-2xl hover:scale-110 transition-transform"
                type="button"
              >
                👍
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="text-2xl hover:scale-110 transition-transform"
                type="button"
              >
                👎
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
