"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import FamilyMemberRadio from "@/components/forms/FamilyMemberRadio";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { usePackageStore } from "@/stores/packageStore";
import { useRedemptionStore } from "@/stores/redemptionStore";
import { calculateAge } from "@/lib/constants";
import type { FamilyMemberOption } from "@/types";

export default function SelectMemberPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;

  const user = useAuthStore((state) => state.user);
  const dependents = useFamilyStore((state) => state.dependents);
  const userPackages = usePackageStore((state) => state.userPackages);
  const { startRedemption, setSelectedMember } = useRedemptionStore();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberOption[]>([]);

  // Find the package
  const pkg = userPackages.find((p) => p.id === packageId);

  useEffect(() => {
    // Redirect if package not found
    if (!pkg && userPackages.length > 0) {
      router.push("/my-packages");
      return;
    }

    // Start redemption session
    if (pkg) {
      startRedemption(pkg);
    }
  }, [pkg, userPackages, router, startRedemption]);

  useEffect(() => {
    // Build family member options
    if (!user) return;

    const members: FamilyMemberOption[] = [];

    // Add primary user (self)
    members.push({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      isSelf: true,
      ageLabel: "Myself",
    });

    // Add dependents with calculated age
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

    setFamilyMembers(members);
  }, [user, dependents]);

  const handleSelectMember = (memberId: string, memberName: string) => {
    setSelectedMemberId(memberId);
    setSelectedMember(memberId, memberName);
  };

  const handleContinue = () => {
    if (!selectedMemberId) return;
    router.push(`/redeem/${packageId}/confirm-copay`);
  };

  if (!pkg || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-200">
      {/* Header */}
      <Header title="Use package" showBack={true} />

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-32">
        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Who is this visit for?
        </h1>
        <p className="text-neutral-600 mb-6">
          Select the family member who will be visiting the facility.
        </p>

        {/* Selection Card */}
        <div className="rounded-2xl border border-neutral-400 bg-white overflow-hidden">
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

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <button
          onClick={handleContinue}
          disabled={!selectedMemberId}
          className={`w-full rounded-full py-4 text-base font-semibold transition-all ${
            selectedMemberId
              ? "bg-primary-900 text-white border-2 border-neutral-900"
              : "bg-neutral-400 text-neutral-600 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
