"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Info, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

const DELETED_ITEMS = [
  "Your personal information",
  "All visit history and receipts",
  "All dependent (children) records",
  "Saved payment methods",
  "Referral history and pending rewards",
];

export default function DeleteAccountPage() {
  const router = useRouter();
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleDownloadData = () => {
    toast.info("Data export coming soon", {
      description: "This feature will be available in a future update.",
    });
  };

  const handleContinueToDelete = async () => {
    // For MVP, show confirmation and then delete
    const confirmed = window.confirm(
      "Are you absolutely sure? This will permanently delete your account and all associated data."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      // Call deleteAccount which handles API call and clears all stores
      await deleteAccount();
      toast.success("Account deleted successfully");
      router.push("/sign-in");
    } catch {
      toast.error("Failed to delete account", {
        description: "Please try again or contact support.",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200">
      <div className="px-4 py-6 space-y-4">
        {/* Centered Top Section */}
        <div className="flex flex-col items-center text-center py-4">
          {/* Emoji */}
          <div className="mb-4 text-[64px] leading-none" role="img" aria-label="pleading face">
            🥺
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Delete your account?
          </h2>

          {/* Subtitle */}
          <p className="text-base text-neutral-500">
            This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Warning Card */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#FEF3C7" }}
        >
          <p className="text-base font-semibold text-neutral-900 mb-3">
            What will be deleted:
          </p>
          <div className="border-t border-neutral-400/30 pt-3">
            <ul className="space-y-2.5">
              {DELETED_ITEMS.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <X size={18} className="text-error-900 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Download Data Card */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#E3F1FC" }}
        >
          <div className="flex items-start gap-3">
            <Info size={20} className="text-secondary-900 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base font-semibold text-neutral-900 mb-1">
                Download your data first?
              </p>
              <p className="text-sm text-neutral-700 mb-3">
                Get a copy of your health records and visit history before
                deleting.
              </p>
              <button
                onClick={handleDownloadData}
                className="flex items-center gap-1 text-sm font-medium text-secondary-900"
              >
                Download my data
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="pt-4 space-y-3">
          {/* Cancel */}
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="w-full text-base font-semibold text-neutral-900 py-3 disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Continue to Delete */}
          <button
            onClick={handleContinueToDelete}
            disabled={isDeleting}
            className="w-full h-12 rounded-xl border-[1.5px] border-neutral-900 bg-error-100 text-base font-semibold text-neutral-900 transition-colors hover:bg-error-100/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Continue to delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
