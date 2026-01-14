"use client";

import { useRouter } from "next/navigation";
import { Info, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import ProfileAvatar from "@/components/common/ProfileAvatar";

interface InfoRowProps {
  label: string;
  value: string;
  onEdit?: () => void;
  isLast?: boolean;
}

function InfoRow({ label, value, onEdit, isLast = false }: InfoRowProps) {
  return (
    <div
      className={`py-4 ${!isLast ? "border-b border-neutral-400" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-700 mb-1">{label}</p>
          <p className="text-base font-medium text-neutral-900 wrap-break-word">
            {value}
          </p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-base text-secondary-900 underline shrink-0 mt-5"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatPhoneNumber(phone: string): string {
  // Format: +256 782 016 535
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("256") && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export default function PersonalInfoPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleEditPhone = () => {
    toast.info("Contact support to change your phone number");
  };

  const handleContactSupport = () => {
    // Could open email client or navigate to support page
    router.push("/profile/help/contact");
  };

  if (!user) {
    return null;
  }

  const fullName = `${user.lastName} ${user.firstName}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 space-y-4">
        {/* Avatar Section */}
        <div className="flex justify-center py-4">
          <ProfileAvatar name={fullName} size="md" />
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-4xl px-6 py-2 border border-neutral-400">
          <InfoRow
            label="Full name"
            value={fullName}
          />
          <InfoRow
            label="Phone number"
            value={formatPhoneNumber(user.phone)}
            onEdit={handleEditPhone}
          />
          <InfoRow
            label="National ID Number (NIN)"
            value={user.nin || "Not provided"}
          />
          <InfoRow
            label="Member ID"
            value={user.memberId || "A-012345"}
          />
          <InfoRow
            label="Member since"
            value={formatDate(user.createdAt)}
            isLast
          />
        </div>

        {/* Support Info Card */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#E3F1FC" }}
        >
          <div className="flex items-start gap-3">
            <Info size={20} className="text-secondary-900 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base font-bold text-neutral-900 mb-1">
                Need to update your name or NIN?
              </p>
              <p className="text-sm text-neutral-900 mb-3">
                Contact our support team for assistance with identity changes.
              </p>
              <button
                onClick={handleContactSupport}
                className="flex items-center gap-1 text-base font-medium text-secondary-900"
              >
                Contact Support
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
