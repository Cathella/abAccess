import { UserPackage, PackageCategory } from '@/types';
import { formatDate } from '@/lib/utils/dateUtils';

interface PackageSelectRadioProps {
  package: UserPackage;
  selected: boolean;
  onSelect: () => void;
  isLast?: boolean;
}

// Helper function to get display name for package category
function getCategoryDisplayName(category: PackageCategory): string {
  const categoryMap: Record<PackageCategory, string> = {
    [PackageCategory.CONSULTATIONS]: 'Consultations',
    [PackageCategory.CHILD_WELLNESS]: 'Child Wellness',
    [PackageCategory.MATERNITY]: 'Maternity',
    [PackageCategory.LAB_TESTS]: 'Lab Tests',
    [PackageCategory.DENTAL]: 'Dental',
    [PackageCategory.OPTICAL]: 'Optical',
  };
  return categoryMap[category] || 'Package';
}

export default function PackageSelectRadio({
  package: pkg,
  selected,
  onSelect,
  isLast = false,
}: PackageSelectRadioProps) {
  const categoryName = pkg.package ? getCategoryDisplayName(pkg.package.category) : 'Package';
  const packageName = pkg.package?.name || '';
  const remainingVisits = pkg.visitsRemaining || 0;
  const expiryDate = formatDate(pkg.expiryDate);

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center p-4 text-left transition-colors hover:bg-gray-50 ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      {/* Radio Button */}
      <div className="flex-shrink-0 mr-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selected
              ? 'bg-[#3A8DFF] border-[#3A8DFF]'
              : 'border-gray-300 bg-white'
          }`}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>

      {/* Package Info */}
      <div className="flex-1 min-w-0">
        {/* Row 1: Category name + package name */}
        <div className="text-gray-900">
          <span className="font-semibold">{categoryName}</span>
          {packageName && (
            <span className="text-gray-500"> ({packageName})</span>
          )}
        </div>

        {/* Row 2: Remaining visits + Expiry date */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <span>Remaining: {remainingVisits} {remainingVisits === 1 ? 'visit' : 'visits'}</span>
          <span>Expires on: {expiryDate}</span>
        </div>
      </div>
    </button>
  );
}
