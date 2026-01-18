"use client";

import { PackageStatusType } from "@/types";

interface TabFilterProps {
  activeTab: PackageStatusType;
  onTabChange: (tab: PackageStatusType) => void;
}

export function TabFilter({ activeTab, onTabChange }: TabFilterProps) {
  const tabs: { value: PackageStatusType; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Used" },
    { value: "expired", label: "Expired" },
  ];

  return (
    <div className="mt-4 w-full rounded-xl bg-neutral-200 p-1">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex-1 rounded-[10px] px-4 py-2.5 text-sm transition-all ${
              activeTab === tab.value
                ? "bg-white text-neutral-900 font-bold shadow-sm"
                : "bg-transparent text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
