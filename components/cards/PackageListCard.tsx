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
        flex items-center justify-between p-4
        bg-white cursor-pointer
        hover:bg-gray-50 transition-colors
        ${!isLast ? 'border-b border-gray-100' : ''}
      `}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
          {pkg.isBestValue && (
            <span
              className="px-2 py-0.5 text-xs font-medium rounded-full"
              style={{
                backgroundColor: '#E8F4E8',
                color: '#2D5A2D',
              }}
            >
              Best Value
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">
            {formatCurrency(pkg.price)} + {formatCurrency(pkg.copay)} co-pay per visit
          </p>
          <span className="border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-600">
            Valid for {pkg.validityDays} days
          </span>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
    </div>
  );
};

export default PackageListCard;
