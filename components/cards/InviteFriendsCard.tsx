"use client";

import { Gift, ChevronRight } from "lucide-react";

interface InviteFriendsCardProps {
  onPress: () => void;
}

export default function InviteFriendsCard({ onPress }: InviteFriendsCardProps) {
  return (
    <button
      onClick={onPress}
      className="w-full bg-white border border-neutral-300 rounded-2xl p-4 flex items-center gap-3 text-left"
    >
      {/* Icon Circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#E8F4F1" }}
      >
        <Gift size={24} className="text-primary-900" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <span className="block text-base font-semibold text-neutral-900">
          Invite Friends
        </span>
        <span className="block text-sm text-neutral-500">
          Earn free visits!
        </span>
      </div>

      {/* Chevron */}
      <ChevronRight size={20} className="text-neutral-500 shrink-0" />
    </button>
  );
}
