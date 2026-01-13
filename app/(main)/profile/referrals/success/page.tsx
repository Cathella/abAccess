'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReferralsStore } from '@/stores/referralsStore';
import { usePackageStore } from '@/stores/packageStore';
import { cn } from '@/lib/utils';

export default function ReferralSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const friendName = searchParams.get('friend') || 'Your friend';
  const rewardId = searchParams.get('rewardId') || '';

  const { claimBonusVisit, saveRewardForLater } = useReferralsStore();
  const { userPackages } = usePackageStore();

  // Filter to active packages only
  const activePackages = userPackages.filter((p) => p.status === 'active');

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    activePackages[0]?.id || ''
  );

  const handleAddBonus = () => {
    if (selectedPackageId && rewardId) {
      claimBonusVisit(rewardId, selectedPackageId);
    }
    router.push('/profile/referrals/history');
  };

  const handleSaveForLater = () => {
    saveRewardForLater(rewardId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Party Emoji */}
      <span className="text-6xl mb-4">🥳</span>

      {/* Title & Subtitle */}
      <h1 className="text-xl font-bold text-gray-900 mb-2">Your friend joined!</h1>
      <p className="text-gray-500 text-center mb-8 px-4">
        {friendName} signed up using your referral code and bought their first
        package.
      </p>

      {/* Claim Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-4 mb-8">
        <h2 className="text-center font-bold text-[#32C28A] mb-1">
          You earned +1 bonus visit!
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Choose which package to add it to:
        </p>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          {activePackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackageId(pkg.id)}
              className="w-full flex items-center gap-3 py-2"
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  selectedPackageId === pkg.id
                    ? 'border-[#3A8DFF]'
                    : 'border-gray-300'
                )}
              >
                {selectedPackageId === pkg.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3A8DFF]" />
                )}
              </div>
              <span className="text-gray-900">
                {pkg.package.category} ({pkg.package.name})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleSaveForLater}
          className="w-full py-3 text-center font-semibold text-gray-900"
        >
          Save for later
        </button>

        <button
          onClick={handleAddBonus}
          disabled={!selectedPackageId}
          className="w-full py-3 bg-[#32C28A] text-white font-semibold rounded-xl disabled:opacity-50"
        >
          Add bonus visit
        </button>
      </div>
    </div>
  );
}
