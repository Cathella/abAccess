import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const sizeClasses = {
  sm: 'w-12 h-12 text-base',
  md: 'w-20 h-20 text-2xl',
  lg: 'w-24 h-24 text-3xl',
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  size = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-full bg-[#E3F1FC] flex items-center justify-center font-bold text-neutral-700',
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export default ProfileAvatar;
