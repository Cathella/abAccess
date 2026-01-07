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
      className={`w-full flex items-center p-4 text-left transition-colors hover:bg-neutral-200 ${
        !isLast ? 'border-b border-neutral-400' : ''
      }`}
    >
      {/* Radio Button */}
      <div className="shrink-0 mr-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selected
              ? 'bg-secondary-900 border-secondary-900'
              : 'border-neutral-400 bg-white'
          }`}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-neutral-900">
          {member.name}
        </div>
        <div className="text-sm text-neutral-700">
          {member.ageLabel}
        </div>
      </div>
    </button>
  );
}
