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
    ? 'bg-white rounded-2xl p-4 border-l-4 border-green-400'
    : 'bg-white rounded-2xl p-4 border border-gray-100';

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
        <div className="w-14 h-14 bg-[#E3F1FC] rounded-full flex items-center justify-center">
          <span className="font-bold text-gray-900">
            {referral.friendInitials}
          </span>
        </div>

        {/* Info */}
        <div>
          <p className="font-semibold text-gray-900">{referral.friendName}</p>
          <p className="text-sm text-gray-500">
            {dateLabel} {formatDate(displayDate)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-100 my-3" />

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {isCompleted ? (
          <div className="bg-[#E8F4F1] px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium text-gray-900">
              +1 visit added to {referral.rewardPackageCategory}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">
            Waiting for first package purchase
          </span>
        )}

        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
