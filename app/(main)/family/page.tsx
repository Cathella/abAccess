"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Heart } from "lucide-react";
import {
  useFamilyStore,
  selectMaxDependents,
  selectDependentCount,
  selectCanAddMore
} from "@/stores/familyStore";
import { useAuth } from "@/hooks/useAuth";
import { UserHeader } from "@/components/common/UserHeader";
import { getInitials } from "@/lib/services/dependentService";
import { formatAge } from "@/lib/utils/dateUtils";
import { ROUTES } from "@/lib/constants";

export default function FamilyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const dependents = useFamilyStore((state) => state.dependents);
  const canAddMore = useFamilyStore(selectCanAddMore);
  const dependentCount = useFamilyStore(selectDependentCount);
  const maxDependents = selectMaxDependents();

  const greeting = useMemo(() => {
    if (!user) return "Good morning";
    return `Good morning, ${user.firstName}`;
  }, [user]);

  const handleAddDependent = () => {
    router.push(ROUTES.FAMILY_ADD);
  };

  const handleNotificationsClick = () => {
    router.push(ROUTES.NOTIFICATIONS);
  };

  const handleDependentClick = (dependentId: string) => {
    router.push(ROUTES.FAMILY_DETAIL(dependentId));
  };

  // Empty state
  if (dependents.length === 0) {
    return (
      <>
        <UserHeader
          greeting={greeting}
          memberId={user?.memberId ? `ID: ${user.memberId}` : "ID: N/A"}
          onNotificationsClick={handleNotificationsClick}
        />

        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 pt-24">
          <div className="flex flex-col items-center text-center">
            {/* Heart Icon */}
            <Heart className="mb-6 h-16 w-16 text-[#FF5E74] fill-[#FF5E74]" />

            {/* Title */}
            <h1 className="mb-4 text-xl font-bold text-neutral-900">
              Add your family
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-75 text-base text-neutral-700 leading-[160%]">
              You can add up to 3 dependents to your account. They&apos;ll share your bundles and visit history.
            </p>

            {/* Add Button */}
            <button
              onClick={handleAddDependent}
              className="rounded-xl border-[1.5px] h-10 border-neutral-900 bg-primary-100 px-6 text-base font-bold text-neutral-900 transition-colors hover:bg-primary-100/80"
            >
              Add a dependent
            </button>
          </div>
        </div>
      </>
    );
  }

  // Dependents list view
  return (
    <>
      <UserHeader
        greeting={greeting}
        memberId={user?.memberId ? `ID: ${user.memberId}` : "ID: N/A"}
        onNotificationsClick={handleNotificationsClick}
      />

      <div className="px-6 pb-8 pt-24">
        {/* Section Title Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Your dependents</h2>
          {canAddMore && (
            <button
              onClick={handleAddDependent}
              className="rounded-xl border-2 border-neutral-900 h-10 bg-primary-900 px-4 text-base font-bold text-neutral-900 transition-colors hover:bg-primary-800"
            >
              Add dependent
            </button>
          )}
        </div>

        {/* Dependents List Card */}
        <div className="mt-4 rounded-2xl border-[1.5px] border-neutral-400 bg-white p-4">
          {dependents.map((dependent, index) => (
            <button
              key={dependent.id}
              onClick={() => handleDependentClick(dependent.id)}
              className={`flex w-full items-center py-3 text-left transition-colors hover:bg-neutral-50 ${
                index !== dependents.length - 1 ? "border-b border-neutral-400" : ""
              }`}
            >
              {/* Avatar Circle */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary-100">
                <span className="text-base font-semibold text-neutral-900">
                  {getInitials(dependent.name)}
                </span>
              </div>

              {/* Text Container */}
              <div className="ml-4 flex-1">
                <p className="text-base font-semibold text-neutral-900">
                  {dependent.name}
                </p>
                <p className="text-sm text-neutral-700">
                  {formatAge(dependent.dateOfBirth)} old
                </p>
              </div>

              {/* Chevron Right */}
              <ChevronRight className="h-5 w-5 shrink-0 text-neutral-900" />
            </button>
          ))}
        </div>

        {/* Counter Text */}
        <p className="mt-4 text-center text-sm text-neutral-700">
          {canAddMore
            ? `${dependentCount} out of ${maxDependents} children.`
            : `You've added the maximum of ${maxDependents} members.`}
        </p>
      </div>
    </>
  );
}
