'use client';

import { cn } from '@/lib/utils';
import type { ReferralTabFilter } from '@/types';

interface ReferralTabFilterProps {
  activeTab: ReferralTabFilter;
  onTabChange: (tab: ReferralTabFilter) => void;
}

const tabs: { key: ReferralTabFilter; label: string }[] = [
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
];

export function ReferralTabFilter({ activeTab, onTabChange }: ReferralTabFilterProps) {
  return (
    <div className="bg-[#E3F1FC] rounded-xl p-1 flex">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            'flex-1 py-2 rounded-lg font-medium transition-colors',
            activeTab === tab.key
              ? 'bg-white text-gray-900'
              : 'text-gray-600'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
