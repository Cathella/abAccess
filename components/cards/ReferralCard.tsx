import { Referral } from '@/types';
import { ChevronRight } from 'lucide-react';

interface ReferralCardProps {
  referral: Referral;
  onPress?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ReferralCard({ referral, onPress }: ReferralCardProps) {
  const isCompleted = referral.status === 'completed';

  const cardClasses = isCompleted
    ? 'bg-white rounded-4xl p-4 border border-neutral-400'
    : 'bg-white rounded-4xl p-4 border border-neutral-400';

  const dateLabel = isCompleted ? 'Joined' : 'Signed up';
  const displayDate = isCompleted && referral.completedDate
    ? referral.completedDate
    : referral.signupDate;

  return (
    <div
      className={cardClasses}
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : undefined}
    >
      {/* Top Section */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
          <span className="font-bold text-neutral-900">
            {referral.friendInitials}
          </span>
        </div>

        {/* Info */}
        <div>
          <p className="font-semibold text-neutral-900">{referral.friendName}</p>
          <p className="text-sm text-neutral-700">
            {dateLabel} {formatDate(displayDate)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-neutral-400 my-3" />

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {isCompleted ? (
          <div className="bg-[#E8F4F1] px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium text-neutral-900">
              +1 visit added to {referral.rewardPackageCategory}
            </span>
          </div>
        ) : (
          <span className="text-sm text-neutral-700">
            Waiting for first package purchase
          </span>
        )}

        <ChevronRight className="w-5 h-5 text-neutral-600" />
      </div>
    </div>
  );
}
