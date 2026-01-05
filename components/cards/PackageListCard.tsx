import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AvailablePackage } from '@/types';

interface PackageListCardProps {
  package: AvailablePackage;
  onPress: () => void;
  isLast?: boolean;
}

const PackageListCard: React.FC<PackageListCardProps> = ({
  package: pkg,
  onPress,
  isLast = false,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('UGX', 'UGX');
  };

  return (
    <div
      onClick={onPress}
      className={`
        flex items-center justify-between p-6
        cursor-pointer
        hover:bg-neutral-50 transition-colors
        ${!isLast ? 'border-b border-neutral-400' : ''}
      `}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-base text-neutral-900">{pkg.name}</h3>
          {pkg.isBestValue && (
            <span
              className="px-2 py-0.5 text-sm font-medium rounded-full"
              style={{
                backgroundColor: '#E8F4E8',
                color: '#2D5A2D',
              }}
            >
              Best Value
            </span>
          )}
        </div>

        <div className="">
          <p className="text-sm text-neutral-700 mb-2">
            {formatCurrency(pkg.price)} + {formatCurrency(pkg.copay)} co-pay per visit
          </p>
          <span className="rounded-full px-2 py-0.5 text-sm text-neutral-700 bg-secondary-100">
            Valid for {pkg.validityDays} days
          </span>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-neutral-700 shrink-0 ml-2" />
    </div>
  );
};

export default PackageListCard;
