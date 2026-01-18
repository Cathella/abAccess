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
    activeStyles: 'bg-white text-neutral-900 shadow-sm',
  },
  {
    value: 'completed',
    label: 'Completed',
    activeStyles: 'bg-primary-100 text-neutral-900',
  },
  {
    value: 'canceled',
    label: 'Canceled',
    activeStyles: 'bg-error-100 text-error-900',
  },
];

export function VisitTabFilter({ activeTab, onTabChange, counts }: VisitTabFilterProps) {
  return (
    <div className="flex gap-1 bg-neutral-200 rounded-xl p-1">
      {TAB_CONFIGS.map((tab) => {
        const isActive = activeTab === tab.value;

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
                  : 'bg-transparent text-neutral-700'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
