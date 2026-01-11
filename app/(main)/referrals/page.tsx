'use client';

import { useRouter } from 'next/navigation';
import { useReferralsStore } from '@/stores/referralsStore';
import { RewardCard } from '@/components/cards/RewardCard';
import { REFERRAL_SHARE_MESSAGE } from '@/lib/constants';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function InviteFriendsPage() {
  const router = useRouter();
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
      } catch (err) {
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
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/profile">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-semibold">Invite Friends</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Centered Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Gift Emoji */}
          <div className="text-6xl mb-4">🎁</div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-2">Earn free visits!</h2>

          {/* Subtitle */}
          <p className="text-gray-500 text-center">
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
            href="/referrals/history"
            className="block text-center font-semibold text-gray-900"
          >
            View referral history
          </Link>

          <button
            onClick={handleShare}
            className="w-full py-3 bg-[#32C28A] text-white font-semibold rounded-xl"
          >
            Share invite link
          </button>
        </div>
      </div>
    </div>
  );
}
