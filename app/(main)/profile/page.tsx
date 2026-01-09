"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import ProfileMenuItem from "@/components/common/ProfileMenuItem";
import { LogoutModal } from "@/components/modals/LogoutModal";
import {
  PROFILE_MENU_SECTIONS,
  APP_VERSION,
  APP_BUILD,
} from "@/lib/constants";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenuItemPress = (item: {
    id: string;
    route?: string;
    action?: "logout" | "delete";
  }) => {
    if (item.action === "logout") {
      setShowLogoutModal(true);
    } else if (item.route) {
      router.push(item.route);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      router.push("/sign-in");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleInviteFriends = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join ABA Access",
          text: "Get affordable healthcare with ABA Access! Use my referral link to sign up and earn free visits.",
          url: "https://abaaccess.com/invite",
        });
      } catch {
        // User cancelled or share failed silently
      }
    }
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-200">
      <div className="px-4 py-6 space-y-4">
        {/* Profile Header Section */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#E3F1FC" }}
            >
              <span className="text-xl font-bold text-neutral-900">
                {getInitials()}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-lg font-semibold text-neutral-900">
              {user.firstName} {user.lastName}
            </h2>

            {/* Member ID */}
            <p className="text-sm text-neutral-600">
              ID: {user.memberId || "A-012345"}
            </p>
          </div>
        </div>

        {/* Menu Sections */}
        {PROFILE_MENU_SECTIONS.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl px-4">
            {section.items.map((item) => (
              <ProfileMenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                onPress={() => handleMenuItemPress(item)}
                variant={
                  item.action === "delete" || item.id === "delete"
                    ? "danger"
                    : "default"
                }
              />
            ))}
          </div>
        ))}

        {/* Invite Friends Card */}
        <button
          onClick={handleInviteFriends}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 text-left"
        >
          {/* Mint Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-primary-900" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className="block text-base font-medium text-neutral-900">
              Invite Friends
            </span>
            <span className="block text-sm text-neutral-600">
              Earn free visits!
            </span>
          </div>

          {/* Chevron */}
          <ChevronRight size={20} className="text-neutral-500 flex-shrink-0" />
        </button>

        {/* Footer */}
        <div className="pt-4 pb-8">
          <p className="text-sm text-neutral-500 text-center">
            App Version {APP_VERSION} (Build {APP_BUILD})
          </p>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
