"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import FamilyMemberRadio from "@/components/forms/FamilyMemberRadio";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { usePackageStore } from "@/stores/packageStore";
import { useRedemptionStore } from "@/stores/redemptionStore";
import { calculateAge } from "@/lib/constants";
import { PackageCategory, PackageStatus } from "@/types";
import type {
  FamilyMemberOption,
  UserPackage,
  Package,
  PackageCategoryType,
} from "@/types";

export default function SelectMemberPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;

  const user = useAuthStore((state) => state.user);
  const dependents = useFamilyStore((state) => state.dependents);
  const userPackages = usePackageStore((state) => state.userPackages);
  const { startRedemption, setSelectedMember } = useRedemptionStore();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  // Find the package
  const pkg = userPackages.find((p) => p.id === packageId);
  const redemptionPackage = useMemo<UserPackage | null>(() => {
    if (!pkg) return null;
    const mapCategory = (category: PackageCategoryType): PackageCategory => {
      switch (category) {
        case "consultations":
          return PackageCategory.CONSULTATIONS;
        case "lab_tests":
          return PackageCategory.LAB_TESTS;
        case "maternity":
          return PackageCategory.MATERNITY;
        case "dental":
          return PackageCategory.DENTAL;
        case "optical":
          return PackageCategory.OPTICAL;
        case "pharmacy":
        default:
          return PackageCategory.CONSULTATIONS;
      }
    };
    const mappedPackage: Package = {
      id: pkg.package.id,
      name: pkg.package.name,
      description: pkg.package.description,
      price: pkg.package.price,
      visitCount: pkg.package.visits,
      validityDays: pkg.package.validityDays,
      copay: pkg.package.copay,
      category: mapCategory(pkg.package.category),
      facilities: [],
      features: [],
      isActive: true,
    };
    return {
      id: pkg.id,
      userId: pkg.userId,
      packageId: pkg.packageId,
      package: mappedPackage,
      purchaseDate: pkg.purchaseDate,
      expiryDate: pkg.expiryDate,
      visitsRemaining: pkg.remainingVisits,
      visitsUsed: pkg.usedVisits,
      status:
        pkg.status === "active"
          ? PackageStatus.ACTIVE
          : pkg.status === "completed"
          ? PackageStatus.EXHAUSTED
          : PackageStatus.EXPIRED,
    };
  }, [pkg]);

  useEffect(() => {
    // Redirect if package not found
    if (!pkg && userPackages.length > 0) {
      router.push("/my-packages");
      return;
    }

    // Start redemption session
    if (redemptionPackage) {
      startRedemption(redemptionPackage);
    }
  }, [pkg, redemptionPackage, userPackages, router, startRedemption]);

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
    if (!selectedMemberId) return;
    router.push(`/redeem/${packageId}/select-facility`);
  };

  if (!pkg || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Use package" showBack={true} />

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
