"use client";

import type { ApprovalTabFilter as ApprovalTabFilterType } from "@/types";

interface ApprovalTabFilterProps {
  activeTab: ApprovalTabFilterType;
  onTabChange: (tab: ApprovalTabFilterType) => void;
}

interface TabConfig {
  key: ApprovalTabFilterType;
  label: string;
  activeStyles: string;
}

const TAB_CONFIGS: TabConfig[] = [
  {
    key: 'approved',
    label: 'Approved',
    activeStyles: 'bg-primary-100 text-primary-900',
  },
  {
    key: 'declined',
    label: 'Declined',
    activeStyles: 'bg-white text-neutral-900',
  },
  {
    key: 'expired',
    label: 'Expired',
    activeStyles: 'bg-white text-neutral-900',
  },
];

export function ApprovalTabFilter({ activeTab, onTabChange }: ApprovalTabFilterProps) {
  return (
    <div className="flex gap-1 bg-neutral-200 rounded-xl p-1">
      {TAB_CONFIGS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              flex-1 py-2 rounded-lg
              text-sm font-medium
              transition-all duration-200
              ${isActive ? tab.activeStyles : 'bg-transparent text-neutral-700'}
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
