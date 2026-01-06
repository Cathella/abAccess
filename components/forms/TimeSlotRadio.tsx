import type { TimeSlotOption, TimeSlot } from '@/types';

interface TimeSlotRadioProps {
  options: TimeSlotOption[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export default function TimeSlotRadio({
  options,
  selectedSlot,
  onSelectSlot,
}: TimeSlotRadioProps) {
  return (
    <div className="rounded-2xl border border-neutral-400 bg-white p-4">
      {/* Header */}
      <h3 className="font-semibold text-neutral-900 mb-3">Preferred time</h3>
      <div className="border-b border-neutral-400 mb-4" />

      {/* Options List */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedSlot === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onSelectSlot(option.value)}
              className="w-full flex items-center text-left transition-colors hover:bg-gray-50 p-2 rounded-lg"
            >
              {/* Radio Button */}
              <div className="flex-shrink-0 mr-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#3A8DFF] border-[#3A8DFF]'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              {/* Label */}
              <div className="flex-1">
                <span className="font-medium text-neutral-900">
                  {option.label}
                </span>
                <span className="text-gray-500"> ({option.hours})</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
