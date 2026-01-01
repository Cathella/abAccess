"use client";

import type { VisitTabFilter as VisitTabFilterType } from "@/types";

interface VisitTabFilterProps {
  activeTab: VisitTabFilterType;
  onTabChange: (tab: VisitTabFilterType) => void;
  counts?: {
    upcoming: number;
    completed: number;
    canceled: number;
  };
}

interface TabConfig {
  value: VisitTabFilterType;
  label: string;
  activeStyles: string;
}

const TAB_CONFIGS: TabConfig[] = [
  {
    value: 'upcoming',
    label: 'Upcoming',
    activeStyles: 'bg-white text-gray-900 shadow-sm',
  },
  {
    value: 'completed',
    label: 'Completed',
    activeStyles: 'bg-[#32C28A] text-white',
  },
  {
    value: 'canceled',
    label: 'Canceled',
    activeStyles: 'bg-[#FEE2E2] text-[#991B1B]',
  },
];

export function VisitTabFilter({ activeTab, onTabChange, counts }: VisitTabFilterProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      {TAB_CONFIGS.map((tab) => {
        const isActive = activeTab === tab.value;
        const count = counts?.[tab.value];

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              flex-1 px-4 py-2 rounded-lg
              text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? tab.activeStyles
                  : 'bg-transparent text-gray-600'
              }
            `}
          >
            {tab.label}
            {count !== undefined && ` (${count})`}
          </button>
        );
      })}
    </div>
  );
}
