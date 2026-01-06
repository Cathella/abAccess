"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Header } from "@/components/common/Header";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { BookingSummaryCard } from "@/components/cards/BookingSummaryCard";
import { BookingInfoCard } from "@/components/cards/BookingInfoCard";
import { useBookingStore } from "@/stores/bookingStore";
import { TIME_SLOT_OPTIONS } from "@/lib/constants";
import { PackageCategory } from "@/types";

export default function ConfirmBookingPage() {
  const router = useRouter();

  const { session, canSubmit } = useBookingStore();

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!canSubmit()) {
      router.push("/book/select-package");
    }
  }, [canSubmit, router]);

  // Helper function to get category display name
  const getCategoryDisplayName = (category: PackageCategory): string => {
    const categoryMap: Record<PackageCategory, string> = {
      [PackageCategory.CONSULTATIONS]: "Consultations",
      [PackageCategory.CHILD_WELLNESS]: "Child Wellness",
      [PackageCategory.MATERNITY]: "Maternity",
      [PackageCategory.LAB_TESTS]: "Lab Tests",
      [PackageCategory.DENTAL]: "Dental",
      [PackageCategory.OPTICAL]: "Optical",
    };
    return categoryMap[category] || "Package";
  };

  // Format date as "Fri, 7 Jan 2026"
  const formattedDate = useMemo(() => {
    if (!session.selectedDate) return "";
    try {
      return format(parseISO(session.selectedDate), "EEE, d MMM yyyy");
    } catch {
      return session.selectedDate;
    }
  }, [session.selectedDate]);

  // Format time slot with hours
  const formattedTimeSlot = useMemo(() => {
    if (!session.selectedTimeSlot) return "";
    const timeSlot = TIME_SLOT_OPTIONS.find(
      (slot) => slot.value === session.selectedTimeSlot
    );
    return timeSlot ? `${timeSlot.label} (${timeSlot.hours})` : "";
  }, [session.selectedTimeSlot]);

  // Format copay
  const formattedCopay = useMemo(() => {
    const copay = session.package?.package?.copay || 0;
    return `UGX ${copay.toLocaleString()}`;
  }, [session.package]);

  // Format remaining visits
  const formattedRemainingVisits = useMemo(() => {
    const remaining = (session.package?.visitsRemaining || 1) - 1;
    const total = session.package?.package?.visitCount || 0;
    return `${remaining} of ${total} visits`;
  }, [session.package]);

  // Build details array for BookingSummaryCard
  const bookingDetails = useMemo(() => {
    return [
      { label: "Patient", value: session.memberName || "" },
      { label: "Facility", value: session.facility?.name || "" },
      { label: "Date", value: formattedDate },
      { label: "Preferred time", value: formattedTimeSlot },
      { label: "Co-pay due", value: formattedCopay },
      { label: "Remaining after", value: formattedRemainingVisits },
    ];
  }, [
    session.memberName,
    session.facility,
    formattedDate,
    formattedTimeSlot,
    formattedCopay,
    formattedRemainingVisits,
  ]);

  // Get package category and name
  const packageCategory = session.package?.package?.category
    ? getCategoryDisplayName(session.package.package.category)
    : "Package";
  const packageName = session.package?.package?.name || "";

  // Handle submit
  const handleSubmit = () => {
    if (!canSubmit()) return;

    // Navigate to submitting page (which will handle the actual submission)
    router.push("/book/submitting");
  };

  if (!canSubmit()) {
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
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Confirm booking
        </h1>
        <p className="text-neutral-600 mb-6">
          Review your booking details before submitting.
        </p>

        {/* Booking Summary Card */}
        <div className="mb-4">
          <BookingSummaryCard
            packageCategory={packageCategory}
            packageName={packageName}
            details={bookingDetails}
          />
        </div>

        {/* Booking Info Card */}
        <BookingInfoCard
          title="Booking confirmation"
          message="The facility will review your request and confirm a specific time. This usually takes 1-2 hours."
          icon="info"
        />
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <PrimaryButton onClick={handleSubmit}>
          Submit booking
        </PrimaryButton>
      </div>
    </div>
  );
}
