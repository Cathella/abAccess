"use client";

import { Hospital, ChevronRight } from "lucide-react";
import type { BookingFacility } from "@/types";

interface FacilityCardProps {
  facility: BookingFacility;
  onPress: () => void;
}

export function FacilityCard({ facility, onPress }: FacilityCardProps) {
  return (
    <button
      onClick={onPress}
      className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-left transition-colors hover:bg-gray-50"
    >
      {/* Top section: Icon + Name + Distance/Rating */}
      <div className="flex items-start gap-3">
        {/* Icon container */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F4F1] p-3">
          <Hospital className="h-6 w-6 text-primary-800" strokeWidth={2} />
        </div>

        {/* Facility info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h4 className="font-semibold text-gray-900 mb-1">
            {facility.name}
          </h4>

          {/* Distance + Rating */}
          <p className="text-sm text-gray-500">
            {facility.distanceLabel} · 👍 {facility.recommendationPercent}% recommended
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 border-b border-gray-100" />

      {/* Bottom section: Badges + Chevron */}
      <div className="flex items-center gap-2">
        {/* Status badge */}
        {facility.isOpen ? (
          facility.closingTime ? (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">
              Closes {facility.closingTime}
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
              Open now
            </span>
          )
        ) : (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            Closed
          </span>
        )}

        {/* Booking badge */}
        {facility.acceptsBookings ? (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            Accepts bookings
          </span>
        ) : facility.isWalkInOnly ? (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            Walk-in only
          </span>
        ) : null}

        {/* Chevron right on far right */}
        <div className="flex-1" />
        <ChevronRight className="h-5 w-5 shrink-0 text-gray-700" />
      </div>
    </button>
  );
}
