"use client";

import { Info } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import ToggleRow from "@/components/common/ToggleRow";
import type { NotificationPreferences } from "@/types";

interface NotificationOption {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  {
    key: "appointmentReminders",
    label: "Appointment reminders",
    description: "Get reminded before your visits",
  },
  {
    key: "packageUpdates",
    label: "Package updates",
    description: "Expiry warnings and usage updates",
  },
  {
    key: "remoteApprovals",
    label: "Remote approvals",
    description: "When someone requests to use your package",
  },
  {
    key: "bookingUpdates",
    label: "Booking updates",
    description: "Confirmations and changes to bookings",
  },
  {
    key: "promotionsOffers",
    label: "Promotions & offers",
    description: "Special deals and new features",
  },
];

export default function NotificationsPage() {
  const notificationPreferences = useSettingsStore(
    (state) => state.notificationPreferences
  );
  const setNotificationPreference = useSettingsStore(
    (state) => state.setNotificationPreference
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 space-y-4">
        {/* Title Section */}
        <div className="px-1">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Choose what notifications you receive
          </h2>
          <p className="text-base text-neutral-700">
            Stay informed about your appointments, packages, and account
            activity.
          </p>
        </div>

        {/* Toggles Card */}
        <div className="bg-white rounded-4xl px-4 border border-neutral-400">
          {NOTIFICATION_OPTIONS.map((option) => (
            <ToggleRow
              key={option.key}
              label={option.label}
              description={option.description}
              enabled={notificationPreferences[option.key]}
              onToggle={(value) => setNotificationPreference(option.key, value)}
            />
          ))}
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
                Some notifications can&apos;t be turned off
              </p>
              <p className="text-sm text-neutral-700">
                Security alerts and important account updates will always be
                sent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
