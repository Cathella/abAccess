"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface MemberOption {
  id: string;
  name: string;
  isSelf: boolean;
}

interface MemberFilterDropdownProps {
  selectedMemberId: string | 'all';
  onSelect: (memberId: string | 'all') => void;
  members: MemberOption[];
}

export function MemberFilterDropdown({
  selectedMemberId,
  onSelect,
  members,
}: MemberFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get display label for selected member
  const getSelectedLabel = () => {
    if (selectedMemberId === 'all') {
      return 'All family members';
    }
    const member = members.find(m => m.id === selectedMemberId);
    if (member) {
      return member.isSelf ? `${member.name} (Myself)` : member.name;
    }
    return 'All family members';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Handle option selection
  const handleSelect = (id: string | 'all') => {
    onSelect(id);
    setIsOpen(false);
  };

  // Prepare options list
  const options: Array<{ id: string | 'all'; label: string; isSelected: boolean }> = [
    {
      id: 'all',
      label: 'All family members',
      isSelected: selectedMemberId === 'all',
    },
    ...members.map(member => ({
      id: member.id,
      label: member.isSelf ? `${member.name} (Myself)` : member.name,
      isSelected: selectedMemberId === member.id,
    })),
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <span>{getSelectedLabel()}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-full min-w-[250px] bg-white rounded-2xl shadow-lg z-50 p-2">
          {options.map((option, index) => (
            <div key={option.id}>
              {/* Option Button */}
              <button
                onClick={() => handleSelect(option.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                {/* Radio Button */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      option.isSelected
                        ? 'border-[#3A8DFF] bg-[#3A8DFF]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {option.isSelected && (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`text-sm font-medium ${
                    option.isSelected ? 'text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </span>
              </button>

              {/* Divider (not after last item) */}
              {index < options.length - 1 && (
                <div className="border-b border-gray-100 my-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
