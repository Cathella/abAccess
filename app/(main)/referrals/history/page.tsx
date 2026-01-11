'use client';

import { useReferralsStore } from '@/stores/referralsStore';
import { ReferralTabFilter } from '@/components/common/ReferralTabFilter';
import { ReferralCard } from '@/components/cards/ReferralCard';
import { ChevronLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default function ReferralHistoryPage() {
  const { activeTab, setActiveTab, getFilteredReferrals } = useReferralsStore();

  const referrals = getFilteredReferrals();
  const hasReferrals = referrals.length > 0;

  const emptyMessage = activeTab === 'completed'
    ? "No completed referrals yet. Share your link to start earning!"
    : "No pending referrals. Share your invite link to get started!";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/referrals">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-semibold">Referral History</h1>
      </header>

      {/* Tab Filter */}
      <div className="px-4 py-4">
        <ReferralTabFilter
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content */}
      {!hasReferrals ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
          <Users className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">{emptyMessage}</p>
        </div>
      ) : (
        <div className="px-4 pb-8 space-y-3">
          {referrals.map((referral) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
            />
          ))}
        </div>
      )}
    </div>
  );
}
