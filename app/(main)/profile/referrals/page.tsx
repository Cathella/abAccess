'use client';

import { useReferralsStore } from '@/stores/referralsStore';
import { RewardCard } from '@/components/cards/RewardCard';
import { REFERRAL_SHARE_MESSAGE } from '@/lib/constants';
import Link from 'next/link';

export default function InviteFriendsPage() {
  const { referralCode } = useReferralsStore();

  const handleShare = async () => {
    const shareData = {
      title: 'Join ABA Access',
      text: REFERRAL_SHARE_MESSAGE(referralCode),
      url: `https://abaaccess.com/invite/${referralCode}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.text);
      // TODO: Show toast: "Link copied to clipboard!"
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Centered Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Gift Emoji */}
          <div className="text-6xl mb-4">🎁</div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-2">Earn free visits!</h2>

          {/* Subtitle */}
          <p className="text-neutral-700 text-center">
            Invite friends to AbaAccess. When they join and buy their first
            package, you both get rewarded.
          </p>
        </div>

        {/* Reward Card */}
        <div className="px-4 mb-6">
          <RewardCard />
        </div>

        {/* Bottom Buttons */}
        <div className="px-4 pb-8 space-y-3">
          <Link
            href="/profile/referrals/history"
            className="block text-center font-semibold text-gray-900"
          >
            View referral history
          </Link>

          <button
            onClick={handleShare}
            className="w-full h-12 bg-primary-900 text-neutral-900 border-[1.5px] border-neutral-900 font-semibold rounded-xl"
          >
            Share invite link
          </button>
        </div>
      </div>
    </div>
  );
}
