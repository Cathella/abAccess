"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HelpState {
  faqFeedback: Record<string, boolean>;
  submittedIssues: string[];
  setFAQFeedback: (faqId: string, helpful: boolean) => void;
  addSubmittedIssue: (refNumber: string) => void;
  getFAQFeedback: (faqId: string) => boolean | undefined;
}

export const useHelpStore = create<HelpState>()(
  persist(
    (set, get) => ({
      faqFeedback: {},
      submittedIssues: [],

      setFAQFeedback: (faqId, helpful) => {
        const { faqFeedback } = get();
        set({
          faqFeedback: { ...faqFeedback, [faqId]: helpful },
        });
      },

      addSubmittedIssue: (refNumber) => {
        const { submittedIssues } = get();
        set({
          submittedIssues: [...submittedIssues, refNumber],
        });
      },

      getFAQFeedback: (faqId) => {
        return get().faqFeedback[faqId];
      },
    }),
    {
      name: "aba-help",
    }
  )
);
