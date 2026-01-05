import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  variant = 'info',
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'info':
        return '#E3F1FC';
      case 'warning':
        return '#FEF3C7';
      case 'success':
        return '#E8F4E8';
      default:
        return '#E3F1FC';
    }
  };

  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <h3 className="font-semibold text-base text-neutral-900 pb-2 border-b border-secondary-900/20">
        {title}
      </h3>
      <div className="mt-2 text-sm text-neutral-900">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;
