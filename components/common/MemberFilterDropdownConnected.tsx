"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { MemberFilterDropdown } from "./MemberFilterDropdown";

interface MemberFilterDropdownConnectedProps {
  selectedMemberId: string | 'all';
  onSelect: (memberId: string | 'all') => void;
}

/**
 * Connected version of MemberFilterDropdown that automatically
 * pulls user and dependents from stores
 */
export function MemberFilterDropdownConnected({
  selectedMemberId,
  onSelect,
}: MemberFilterDropdownConnectedProps) {
  const user = useAuthStore(state => state.user);
  const dependents = useFamilyStore(state => state.dependents);

  // Build members list from user and dependents
  const members = useMemo(() => {
    const membersList = [];

    // Add current user as first member
    if (user) {
      membersList.push({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        isSelf: true,
      });
    }

    // Add all dependents
    dependents.forEach(dependent => {
      membersList.push({
        id: dependent.id,
        name: dependent.name,
        isSelf: false,
      });
    });

    return membersList;
  }, [user, dependents]);

  return (
    <MemberFilterDropdown
      selectedMemberId={selectedMemberId}
      onSelect={onSelect}
      members={members}
    />
  );
}
