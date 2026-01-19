import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Referral, ReferralTabFilter, BonusReward } from '@/types';
import { MOCK_REFERRALS, MOCK_BONUS_REWARDS } from '@/lib/constants';
import { usePackageStore } from './packageStore';

interface ReferralsState {
  // Data
  referrals: Referral[];
  bonusRewards: BonusReward[];
  isLoading: boolean;

  // Filters
  activeTab: ReferralTabFilter;

  // User's referral code
  referralCode: string;

  // Actions
  setReferrals: (referrals: Referral[]) => void;
  setActiveTab: (tab: ReferralTabFilter) => void;

  // Computed
  getFilteredReferrals: () => Referral[];
  getCompletedCount: () => number;
  getPendingCount: () => number;
  getUnclaimedRewards: () => BonusReward[];

  // Reward claiming
  claimBonusVisit: (rewardId: string, packageId: string) => void;
  saveRewardForLater: (rewardId: string) => void;
}

export const useReferralsStore = create<ReferralsState>()(
  persist(
    (set, get) => ({
      referrals: MOCK_REFERRALS,
      bonusRewards: MOCK_BONUS_REWARDS,
      isLoading: false,
      activeTab: 'completed',
      referralCode: 'ABA-012345', // Would come from user data

      setReferrals: (referrals) => set({ referrals }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      getFilteredReferrals: () => {
        const { referrals, activeTab } = get();
        return referrals.filter((r) => r.status === activeTab);
      },

      getCompletedCount: () => {
        const { referrals } = get();
        return referrals.filter((r) => r.status === 'completed').length;
      },

      getPendingCount: () => {
        const { referrals } = get();
        return referrals.filter((r) => r.status === 'pending').length;
      },

      getUnclaimedRewards: () => {
        const { bonusRewards } = get();
        return bonusRewards.filter((r) => !r.claimed);
      },

      claimBonusVisit: (rewardId, packageId) => {
        const { bonusRewards, referrals } = get();

        // Update bonus reward
        const updatedRewards = bonusRewards.map((r) =>
          r.id === rewardId
            ? { ...r, claimed: true, claimedAt: new Date().toISOString(), packageId }
            : r
        );

        // Update referral record
        const reward = bonusRewards.find((r) => r.id === rewardId);
        const updatedReferrals = reward
          ? referrals.map((ref) =>
              ref.id === reward.referralId
                ? { ...ref, rewardClaimed: true, rewardPackageId: packageId }
                : ref
            )
          : referrals;

        set({ bonusRewards: updatedRewards, referrals: updatedReferrals });

        // Add bonus visit to the package
        usePackageStore.getState().addBonusVisit(packageId);
      },

      saveRewardForLater: (rewardId) => {
        // Just dismiss the notification, keep reward unclaimed
        // Could navigate away or close modal
      },
    }),
    {
      name: 'aba-referrals',
    }
  )
);
