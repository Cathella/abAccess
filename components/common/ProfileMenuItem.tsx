import React from 'react';
import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface ProfileMenuItemProps {
  icon: string;
  label: string;
  description?: string;
  onPress: () => void;
  showChevron?: boolean;
  variant?: 'default' | 'danger';
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  description,
  onPress,
  showChevron = true,
  variant = 'default',
}) => {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ElementType;

  const iconColorClass = variant === 'danger' ? 'text-error-900' : 'text-neutral-700';
  const labelColorClass = variant === 'danger' ? 'text-error-900' : 'text-neutral-900';

  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 py-4 border-b border-neutral-300 last:border-b-0 text-left"
    >
      {/* Icon */}
      <div className={iconColorClass}>
        {IconComponent && <IconComponent size={22} />}
      </div>

      {/* Label & Description */}
      <div className="flex-1 min-w-0">
        <span className={`block text-base font-medium ${labelColorClass}`}>
          {label}
        </span>
        {description && (
          <span className="block text-sm text-neutral-600 mt-0.5">
            {description}
          </span>
        )}
      </div>

      {/* Chevron */}
      {showChevron && (
        <ChevronRight size={20} className="text-neutral-500 flex-shrink-0" />
      )}
    </button>
  );
};

export default ProfileMenuItem;
