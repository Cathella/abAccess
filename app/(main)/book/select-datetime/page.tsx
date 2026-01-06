"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { Header } from "@/components/common/Header";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { CalendarPicker } from "@/components/common/CalendarPicker";
import TimeSlotRadio from "@/components/forms/TimeSlotRadio";
import { useBookingStore } from "@/stores/bookingStore";
import { TIME_SLOT_OPTIONS } from "@/lib/constants";
import type { TimeSlot } from "@/types";

export default function SelectDateTimePage() {
  const router = useRouter();

  const {
    session,
    setSelectedDate,
    setSelectedTimeSlot,
    canProceedToConfirm,
  } = useBookingStore();

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!session.packageId || !session.memberId || !session.facilityId) {
      router.push("/book/select-package");
    }
  }, [session.packageId, session.memberId, session.facilityId, router]);

  // Calculate min and max dates
  const tomorrow = addDays(new Date(), 1);
  const minDate = format(tomorrow, "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 30), "yyyy-MM-dd");

  // Check if facility is closed on Sundays
  const disableSundays = useMemo(() => {
    return session.facility?.hours.sunday === "Closed";
  }, [session.facility]);

  // Handle date selection
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  // Handle time slot selection
  const handleSelectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  // Handle continue
  const handleContinue = () => {
    if (!canProceedToConfirm()) return;
    router.push("/book/confirm");
  };

  if (!session.packageId || !session.memberId || !session.facilityId) {
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
          Select date & time
        </h1>
        <p className="text-neutral-600 mb-6">
          Choose your preferred appointment time. The facility will confirm availability.
        </p>

        {/* Calendar Section */}
        <div className="mb-4">
          <CalendarPicker
            selectedDate={session.selectedDate}
            onSelectDate={handleSelectDate}
            minDate={minDate}
            maxDate={maxDate}
            disableSundays={disableSundays}
          />
        </div>

        {/* Time Slot Section */}
        <TimeSlotRadio
          options={TIME_SLOT_OPTIONS}
          selectedSlot={session.selectedTimeSlot}
          onSelectSlot={handleSelectTimeSlot}
        />

        {/* Optional: Show facility hours hint */}
        {session.facility && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Facility hours:</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Mon-Fri: {session.facility.hours.weekdays}
            </p>
            <p className="text-sm text-gray-600">
              Sat: {session.facility.hours.saturday}
            </p>
            <p className="text-sm text-gray-600">
              Sun: {session.facility.hours.sunday}
            </p>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4">
        <PrimaryButton onClick={handleContinue} disabled={!canProceedToConfirm()}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
