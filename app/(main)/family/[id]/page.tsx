"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { Header } from "@/components/common/Header";
import { SafeArea } from "@/components/common/SafeArea";
import { RemoveDependentModal } from "@/components/modals/RemoveDependentModal";
import { useFamilyStore } from "@/stores/familyStore";
import {
  getInitials,
  removeDependent as removeDependendService,
  getDependentVisits,
} from "@/lib/services/dependentService";
import {
  calculateAge,
  formatDate,
  formatRelativeTime,
} from "@/lib/utils/dateUtils";
import { ROUTES } from "@/lib/constants";

interface DependentVisit {
  id: string;
  dependentId: string;
  facilityName: string;
  date: string;
  packageName: string;
}

export default function DependentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const getDependentById = useFamilyStore((state) => state.getDependentById);
  const removeDependent = useFamilyStore((state) => state.removeDependent);

  const [visits, setVisits] = useState<DependentVisit[]>([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const dependent = getDependentById(id);

  // Redirect if dependent not found
  useEffect(() => {
    if (!dependent) {
      router.replace(ROUTES.FAMILY);
    }
  }, [dependent, router]);

  // Fetch visits
  useEffect(() => {
    if (!dependent) return;

    const fetchVisits = async () => {
      setIsLoadingVisits(true);
      const result = await getDependentVisits(dependent.id, 3);

      if (result.success && result.visits) {
        setVisits(result.visits);
      }
      setIsLoadingVisits(false);
    };

    fetchVisits();
  }, [dependent]);

  if (!dependent) {
    return null;
  }

  const age = calculateAge(dependent.dateOfBirth);
  const initials = getInitials(dependent.name);
  const hasVisits = visits.length > 0;

  const handleRemove = async () => {
    setIsRemoving(true);

    const result = await removeDependendService(dependent.id);

    if (result.success) {
      // Remove from store
      removeDependent(dependent.id);
      // Navigate back to family page
      router.push(ROUTES.FAMILY);
    } else {
      // Show error
      alert(result.error || "Failed to remove dependent");
      setIsRemoving(false);
      setShowRemoveModal(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title={dependent.name} showBack />

      {/* Divider */}
      <div className="h-px bg-neutral-400" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Profile Card */}
        <div className="mx-6 mt-6">
          <div className="rounded-2xl border border-neutral-400 bg-white p-6">
            {/* Avatar */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-100">
                <span className="text-2xl font-bold text-secondary-900">
                  {initials}
                </span>
              </div>
            </div>

            {/* Name */}
            <h2 className="mb-1 text-center text-lg font-bold text-neutral-900">
              {dependent.name}
            </h2>

            {/* Age */}
            <p className="mb-4 text-center text-sm text-neutral-600">
              {age} {age === 1 ? "year" : "years"} old
            </p>

            {/* Divider */}
            <div className="mb-3 h-px bg-neutral-200" />

            {/* Info Rows */}
            <div className="space-y-3">
              {/* Gender */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-600">Gender</span>
                <span className="text-sm text-neutral-900">
                  {dependent.gender === "female" ? "Female" : "Male"}
                </span>
              </div>

              {/* Date of Birth */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-600">Date of birth</span>
                <span className="text-sm text-neutral-900">
                  {formatDate(dependent.dateOfBirth)}
                </span>
              </div>

              {/* Added */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-600">Added</span>
                <span className="text-sm text-neutral-900">
                  {formatRelativeTime(dependent.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Visits Section */}
        <div className="mx-6 mt-6">
          {/* Section Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">Recent visits</h3>
            {hasVisits && (
              <button
                onClick={() => router.push(`${ROUTES.VISITS}?dependentId=${id}`)}
                className="text-sm font-medium text-secondary-900 hover:underline"
              >
                View all
              </button>
            )}
          </div>

          {/* Visits Content */}
          {isLoadingVisits ? (
            <div className="rounded-2xl border border-dashed border-neutral-400 bg-white p-8 text-center">
              <p className="text-sm text-neutral-600">Loading visits...</p>
            </div>
          ) : hasVisits ? (
            /* Visits List */
            <div className="overflow-hidden rounded-2xl border border-neutral-400 bg-white">
              {visits.map((visit, index) => (
                <div
                  key={visit.id}
                  className={`flex items-center p-4 ${
                    index !== visits.length - 1 ? "border-b border-neutral-200" : ""
                  }`}
                >
                  {/* Icon Circle */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <Building2 className="h-6 w-6 text-primary-900" />
                  </div>

                  {/* Text */}
                  <div className="ml-3 flex-1">
                    <p className="text-base font-semibold text-neutral-900">
                      {visit.facilityName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {formatDate(visit.date)} · {visit.packageName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-neutral-400 bg-white p-8">
              <div className="flex flex-col items-center text-center">
                {/* Calendar Icon */}
                <div className="mb-4 text-5xl" role="img" aria-label="calendar">
                  📅
                </div>

                {/* Title */}
                <h4 className="mb-2 text-base font-semibold text-neutral-900">
                  No visits yet!
                </h4>

                {/* Description */}
                <p className="mb-4 text-sm text-neutral-600">
                  Book {dependent.name.split(" ")[0]}&apos;s first appointment
                </p>

                {/* Book a Visit Button */}
                <button
                  onClick={() =>
                    router.push(`/visits/book?dependentId=${dependent.id}`)
                  }
                  className="rounded-xl border border-neutral-900 bg-transparent px-5 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
                >
                  Book a Visit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions - Fixed */}
      <SafeArea inset="bottom" className="fixed bottom-0 left-0 right-0 bg-white px-6 pb-6">
        {/* Remove from family link */}
        <div className="mb-3 text-center">
          <button
            onClick={() => setShowRemoveModal(true)}
            className="text-sm font-medium text-error-900 hover:underline"
          >
            Remove from family
          </button>
        </div>

        {/* Edit details button */}
        <button
          onClick={() => router.push(`${ROUTES.FAMILY}/${id}/edit`)}
          className="h-14 w-full rounded-2xl border border-neutral-900 bg-secondary-100 text-base font-semibold text-neutral-900 transition-colors hover:bg-secondary-100/80"
        >
          Edit details
        </button>
      </SafeArea>

      {/* Remove Confirmation Modal */}
      <RemoveDependentModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemove}
        dependentName={dependent.name.split(" ")[0]}
        isLoading={isRemoving}
      />
    </div>
  );
}
