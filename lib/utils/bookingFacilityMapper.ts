import type { Database } from "@/types/database";
import type { BookingFacility } from "@/types";
import { formatDistance } from "@/lib/facilities";

type FacilityRow = Database["public"]["Tables"]["facilities"]["Row"];
type OperatingHours = Record<string, { open?: string; close?: string }>;

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function formatTimeLabel(value?: string) {
  if (!value) return "";
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatHoursRange(open?: string, close?: string) {
  if (!open || !close) return "Closed";
  return `${formatTimeLabel(open)} - ${formatTimeLabel(close)}`;
}

function getHoursFromOperating(operatingHours?: OperatingHours | null) {
  if (!operatingHours) {
    return {
      weekdays: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed",
    };
  }

  const pickRange = (keys: Array<keyof OperatingHours>) => {
    for (const key of keys) {
      const entry = operatingHours[key];
      if (entry?.open || entry?.close) {
        return formatHoursRange(entry.open, entry.close);
      }
    }
    return "Closed";
  };

  return {
    weekdays: pickRange(["mon", "tue", "wed", "thu", "fri"]),
    saturday: pickRange(["sat"]),
    sunday: pickRange(["sun"]),
  };
}

function getTodayStatus(operatingHours?: OperatingHours | null) {
  if (!operatingHours) {
    return { isOpen: true, closingTime: "6:00 PM" };
  }
  const key = DAY_KEYS[new Date().getDay()];
  const today = operatingHours[key];
  if (!today?.open || !today?.close) {
    return { isOpen: false, closingTime: undefined };
  }
  return { isOpen: true, closingTime: formatTimeLabel(today.close) };
}

export function mapFacilityRowToBookingFacility(
  facility: FacilityRow,
  index: number
): BookingFacility {
  const distance = Number((1.2 + index * 0.3).toFixed(1));
  const rating = facility.rating ?? 4;
  const recommendationPercent = Math.min(100, Math.max(60, Math.round((rating / 5) * 100)));
  const patientVisits = facility.rating_count ?? 0;
  const hours = getHoursFromOperating(facility.operating_hours as OperatingHours | null);
  const todayStatus = getTodayStatus(facility.operating_hours as OperatingHours | null);

  return {
    id: facility.id,
    name: facility.name,
    address: facility.address,
    distance,
    distanceLabel: formatDistance(distance),
    recommendationPercent,
    patientVisits,
    imageUrl: facility.photo_url ?? undefined,
    hours,
    services: facility.services ?? [],
    acceptsBookings: facility.accepts_booking ?? false,
    isWalkInOnly: !(facility.accepts_booking ?? false),
    isOpen: todayStatus.isOpen,
    closingTime: todayStatus.closingTime,
  };
}
