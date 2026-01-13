"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IssueTypeSelect } from "@/components/forms/IssueTypeSelect";
import { generateReferenceNumber } from "@/lib/constants";
import { IssueType } from "@/types";

export default function ReportIssuePage() {
  const router = useRouter();
  const [issueType, setIssueType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ issueType?: string; description?: string }>({});

  const isValid = issueType && description.trim().length >= 10;

  const validateForm = () => {
    const newErrors: { issueType?: string; description?: string } = {};

    if (!issueType) {
      newErrors.issueType = "Issue type is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Please enter at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const refNumber = generateReferenceNumber();
    router.push(
      `/profile/help/report-issue/success?ref=${encodeURIComponent(refNumber)}`
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What went wrong?
        </h2>
        <p className="text-gray-600 mb-6">
          Tell us what happened and we&apos;ll look into it.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Issue type
            </label>
            <IssueTypeSelect
              value={issueType}
              onChange={setIssueType}
              error={errors.issueType}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Describe the issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happened..."
              className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#32C28A]"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="w-full py-3 bg-[#FEE2E2] border border-gray-900 rounded-xl font-semibold text-gray-900 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit report"}
        </button>
      </div>
    </div>
  );
}
