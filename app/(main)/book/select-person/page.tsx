"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import FamilyMemberRadio from "@/components/forms/FamilyMemberRadio";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { useBookingStore } from "@/stores/bookingStore";
import { calculateAge } from "@/lib/constants";
import type { FamilyMemberOption } from "@/types";

export default function SelectPersonPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const dependents = useFamilyStore((state) => state.dependents);
  const { session, setSelectedMember, canProceedToFacility } = useBookingStore();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Redirect if no package selected
  useEffect(() => {
    if (!session.packageId) {
      router.push("/book/select-package");
    }
  }, [session.packageId, router]);

  const familyMembers = useMemo<FamilyMemberOption[]>(() => {
    if (!user) return [];

    const members: FamilyMemberOption[] = [
      {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        isSelf: true,
        ageLabel: "Myself",
      },
    ];

    dependents.forEach((dependent) => {
      const age = calculateAge(dependent.dateOfBirth);
      members.push({
        id: dependent.id,
        name: dependent.name,
        isSelf: false,
        age,
        ageLabel: `${age} years old`,
      });
    });

    return members;
  }, [dependents, user]);

  const handleSelectMember = (memberId: string, memberName: string) => {
    setSelectedMemberId(memberId);
    setSelectedMember(memberId, memberName);
  };

  const handleContinue = () => {
    if (!selectedMemberId || !canProceedToFacility()) return;
    router.push("/book/select-facility");
  };

  if (!user || !session.packageId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Book a visit" showBack={true} />

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-32">
        {/* Title & Subtitle */}
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          Who is this visit for?
        </h1>
        <p className="text-neutral-700 mb-6">
          Select the family member who will be visiting the facility.
        </p>

        {/* Selection Card */}
        <div className="rounded-4xl border border-neutral-400 bg-white overflow-hidden">
          {familyMembers.map((member, index) => (
            <FamilyMemberRadio
              key={member.id}
              member={member}
              selected={selectedMemberId === member.id}
              onSelect={() => handleSelectMember(member.id, member.name)}
              isLast={index === familyMembers.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <PrimaryButton onClick={handleContinue} disabled={!selectedMemberId}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
