import React from 'react';
import { RecipientType } from '@/types';

interface RecipientOptionProps {
  value: RecipientType;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const RecipientOption: React.FC<RecipientOptionProps> = ({
  value,
  label,
  description,
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={`
        flex items-center gap-4 p-4 w-full
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
        transition-colors
      `}
    >
      {/* Radio Button */}
      <div className="flex-shrink-0">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all
            ${selected
              ? 'border-[#3A8DFF] bg-[#3A8DFF]'
              : 'border-gray-300 bg-white'
            }
          `}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>

      {/* Label and Description */}
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </div>
  );
};

export default RecipientOption;
