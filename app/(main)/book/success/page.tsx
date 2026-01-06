"use client";

import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ResultScreen } from "@/components/common/ResultScreen";
import { BookingSummaryCard } from "@/components/cards/BookingSummaryCard";
import { useBookingStore } from "@/stores/bookingStore";
import { useVisitsStore } from "@/stores/visitsStore";
import { useAuthStore } from "@/stores/authStore";
import { TIME_SLOT_OPTIONS } from "@/lib/constants";
import { PackageCategory } from "@/types";

export default function BookingSuccessPage() {
  const router = useRouter();
  const { confirmation, session, resetBooking } = useBookingStore();
  const addPendingVisit = useVisitsStore((state) => state.addPendingVisit);
  const user = useAuthStore((state) => state.user);
  const hasProcessedRef = useRef(false);

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
    if (!confirmation?.requestedDate) return "";
    try {
      return format(parseISO(confirmation.requestedDate), "EEE, d MMM yyyy");
    } catch {
      return confirmation.requestedDate;
    }
  }, [confirmation?.requestedDate]);

  // Format time slot with hours
  const formattedTimeSlot = useMemo(() => {
    if (!confirmation?.preferredTime) return "";
    const timeSlot = TIME_SLOT_OPTIONS.find(
      (slot) => slot.value === confirmation.preferredTime
    );
    return timeSlot ? `${timeSlot.label} (${timeSlot.hours})` : "";
  }, [confirmation?.preferredTime]);

  // Format copay
  const formattedCopay = useMemo(() => {
    const copay = confirmation?.copayDue || 0;
    return `UGX ${copay.toLocaleString()}`;
  }, [confirmation?.copayDue]);

  // Build details array for BookingSummaryCard
  const bookingDetails = useMemo(() => {
    if (!confirmation) return [];
    return [
      { label: "Patient", value: confirmation.patientName },
      { label: "Facility", value: confirmation.facilityName },
      { label: "Requested date", value: formattedDate },
      { label: "Preferred time", value: formattedTimeSlot },
      { label: "Co-pay due", value: formattedCopay },
    ];
  }, [confirmation, formattedDate, formattedTimeSlot, formattedCopay]);

  // Create visit record on mount
  useEffect(() => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    if (!confirmation || !session || !session.facility || !user) {
      router.push("/book/select-package");
      return;
    }

    // Add pending visit to visits store
    const memberId = session.memberId || user.id;
    const isSelf = session.memberId === user.id;
    const packageId = session.packageId || '';

    addPendingVisit(confirmation, session.facility, memberId, isSelf, packageId);
  }, [confirmation, session, user, router, addPendingVisit]);

  // Get package category and name
  const packageCategory = confirmation?.packageCategory || "Package";
  const packageName = confirmation?.packageName || "";

  // Get facility name for subtitle
  const facilityName = confirmation?.facilityName || "";

  if (!confirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <ResultScreen
      emoji="😊"
      title="Booking request sent!"
      subtitle={`${facilityName} will review your request and confirm a time. We'll notify you.`}
      primaryAction={{
        label: "Done",
        onPress: () => {
          resetBooking();
          router.push("/dashboard");
        },
      }}
      secondaryAction={{
        label: "View my visits",
        onPress: () => {
          resetBooking();
          router.push("/visits");
        },
      }}
    >
      {/* Booking Summary Card */}
      <BookingSummaryCard
        packageCategory={packageCategory}
        packageName={packageName}
        details={bookingDetails}
      />
    </ResultScreen>
  );
}
