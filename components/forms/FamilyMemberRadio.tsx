import { FamilyMemberOption } from '@/types';

interface FamilyMemberRadioProps {
  member: FamilyMemberOption;
  selected: boolean;
  onSelect: () => void;
  isLast?: boolean;
}

export default function FamilyMemberRadio({
  member,
  selected,
  onSelect,
  isLast = false,
}: FamilyMemberRadioProps) {
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

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900">
          {member.name}
        </div>
        <div className="text-sm text-gray-500">
          {member.ageLabel}
        </div>
      </div>
    </button>
  );
}
