"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";

interface MemberFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMemberId: string | 'all';
  onSelect: (memberId: string | 'all') => void;
}

interface MemberOption {
  id: string | 'all';
  name: string;
  isPrimary?: boolean;
}

export function MemberFilterModal({
  isOpen,
  onClose,
  selectedMemberId,
  onSelect,
}: MemberFilterModalProps) {
  const user = useAuthStore((state) => state.user);
  const dependents = useFamilyStore((state) => state.dependents);

  // Build member options list
  const memberOptions: MemberOption[] = [
    // "All family members" option
    { id: 'all', name: 'All family members' },
    // Primary user (if exists)
    ...(user
      ? [{
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          isPrimary: true,
        }]
      : []),
    // Dependents
    ...dependents.map((dependent) => ({
      id: dependent.id,
      name: dependent.name,
      isPrimary: false,
    })),
  ];

  const handleSelect = (memberId: string | 'all') => {
    onSelect(memberId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* Overlay with 50% opacity */}
        <DialogOverlay className="bg-black/50" />

        {/* Modal Content */}
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl bg-white p-4 gap-0 [&>button]:hidden z-50">
          {/* Hidden title for accessibility */}
          <DialogTitle className="sr-only">Filter by family member</DialogTitle>

          {/* Options list */}
          <div className="flex flex-col">
            {memberOptions.map((option, index) => {
              const isSelected = selectedMemberId === option.id;
              const isLast = index === memberOptions.length - 1;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`flex items-center gap-3 py-4 text-left transition-colors hover:bg-gray-50 ${
                    !isLast ? 'border-b border-gray-200' : ''
                  }`}
                >
                  {/* Radio circle */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#3A8DFF] border-[#3A8DFF]'
                        : 'border-gray-300'
                    }`}
                  >
                    {/* Inner dot for selected state */}
                    {isSelected && (
                      <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                    )}
                  </div>

                  {/* Member name */}
                  <span className="text-base text-neutral-900">
                    {option.name}
                    {option.isPrimary && " (Myself)"}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
