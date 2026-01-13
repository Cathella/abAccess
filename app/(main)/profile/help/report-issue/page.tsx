"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IssueType } from "@/types";
import { ISSUE_TYPE_OPTIONS } from "@/lib/constants";

export default function ReportIssuePage() {
  const router = useRouter();
  const [issueType, setIssueType] = useState<IssueType | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ issueType?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { issueType?: string; description?: string } = {};

    if (!issueType) {
      newErrors.issueType = "Please select an issue type";
    }

    if (!description.trim()) {
      newErrors.description = "Please describe the issue";
    } else if (description.trim().length < 10) {
      newErrors.description = "Please provide more details (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    router.push("/profile/help/report-issue/success");
  };

  const isFormValid = issueType && description.trim().length >= 10;

  return (
    <div className="min-h-screen bg-neutral-200 flex flex-col">
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Title Section */}
        <div className="px-1">
          <h2 className="text-2xl font-bold text-neutral-900">
            What went wrong?
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Tell us about the issue and we&apos;ll look into it
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Issue Type Dropdown */}
          <div className="space-y-2">
            <Label className="text-base text-neutral-900">Issue type</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger
                className={`h-12 rounded-xl border-[1.5px] px-4 text-base bg-white ${
                  errors.issueType
                    ? "border-destructive"
                    : "border-neutral-400 focus:border-primary-900"
                }`}
              >
                <SelectValue placeholder="Select an issue type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border border-neutral-300">
                {ISSUE_TYPE_OPTIONS.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="py-3 px-4 text-base cursor-pointer hover:bg-neutral-100"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.issueType && (
              <p className="text-sm text-destructive">{errors.issueType}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <Label className="text-base text-neutral-900">
              Describe the issue
            </Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide as much detail as possible..."
              rows={5}
              className={`w-full rounded-xl border-[1.5px] px-4 py-3 text-base bg-white placeholder:text-neutral-500 focus:outline-none resize-none ${
                errors.description
                  ? "border-destructive focus:border-destructive"
                  : "border-neutral-400 focus:border-primary-900"
              }`}
            />
            <div className="flex justify-between">
              {errors.description ? (
                <p className="text-sm text-destructive">{errors.description}</p>
              ) : (
                <p className="text-sm text-neutral-500">
                  Minimum 10 characters
                </p>
              )}
              <p className="text-sm text-neutral-500">
                {description.length} characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full h-12 rounded-xl font-bold border-[1.5px] border-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isFormValid && !isSubmitting ? "#32C28A" : "#E5E5E5",
            color: isFormValid && !isSubmitting ? "#1A1A1A" : "#9CA3AF",
            borderColor: isFormValid && !isSubmitting ? "#1A1A1A" : "#E5E5E5",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}
