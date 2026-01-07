"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Hospital } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useBookingStore } from "@/stores/bookingStore";
import { createClient } from "@/lib/supabase/client";
import { mapFacilityRowToBookingFacility } from "@/lib/utils/bookingFacilityMapper";
import type { Database } from "@/types/database";
import type { BookingFacility } from "@/types";

const CATEGORY_MAP: Record<string, string> = {
  consultations: "Consultations",
  childWellness: "Child Wellness",
  maternity: "Maternal Care",
  labTests: "Lab Tests",
  dental: "Dental",
  optical: "Optical",
};

function getTodayCloseLabel(facility: BookingFacility) {
  if (!facility.isOpen) return "Closed";
  if (facility.closingTime) return `Closes ${facility.closingTime}`;
  return "Open now";
}

export default function SelectFacilityPage() {
  const router = useRouter();

  const { session, setSelectedFacility } = useBookingStore();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<BookingFacility[]>([]);

  useEffect(() => {
    if (!session.packageId || !session.memberId) {
      router.push("/book/select-package");
      return;
    }

    const loadFacilities = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("facilities")
          .select("*")
          .eq("is_partner", true)
          .order("rating", { ascending: false })
          .limit(20);

        if (error) {
          console.error("Failed to fetch facilities:", error.message);
          setFacilities([]);
          return;
        }

        const mapped = (data || []).map((facility, index) =>
          mapFacilityRowToBookingFacility(
            facility as Database["public"]["Tables"]["facilities"]["Row"],
            index
          )
        );
        setFacilities(mapped);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacilities();
  }, [router, session.memberId, session.packageId]);

  const packageCategory = session.package?.package?.category
    ? CATEGORY_MAP[session.package.package.category] || ""
    : "";

  const filteredFacilities = useMemo(() => {
    const query = search.trim().toLowerCase();
    return facilities
      .filter((facility) => {
        if (!packageCategory) return true;
        return facility.services.some((service) => {
          const serviceValue = service.toLowerCase();
          const categoryValue = packageCategory.toLowerCase();
          return (
            serviceValue.includes(categoryValue) ||
            categoryValue.includes(serviceValue)
          );
        });
      })
      .filter((facility) => {
        if (!query) return true;
        return `${facility.name} ${facility.address}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => a.distance - b.distance);
  }, [facilities, packageCategory, search]);

  const handleSelectFacility = (facility: BookingFacility) => {
    setSelectedFacility(facility);
    router.push(`/book/facility/${facility.id}`);
  };

  if (!session.packageId || !session.memberId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Book a visit" showBack />
      <div className="h-px bg-neutral-400" />

      <div className="flex-1 px-6 pt-6 pb-8">
        <h1 className="text-xl font-bold text-neutral-900 mb-4">
          Select a facility
        </h1>

        <div className="relative">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search facilities..."
            className="h-12 w-full rounded-xl border border-neutral-400 bg-white px-4 pr-12 text-base text-neutral-900 placeholder:text-neutral-700"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
        </div>

        <div className="mt-6 space-y-4">
          {isLoading && (
            <div className="text-base text-neutral-700">Loading facilities...</div>
          )}

          {!isLoading && filteredFacilities.length === 0 && (
            <div className="rounded-2xl border border-neutral-400 bg-neutral-100 p-6 text-center text-base text-neutral-700">
              No facilities found.
            </div>
          )}

          {filteredFacilities.map((facility) => (
            <button
              key={facility.id}
              onClick={() => handleSelectFacility(facility)}
              className="w-full rounded-4xl border border-neutral-400 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                  <Hospital className="h-6 w-6 text-neutral-900" />
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-neutral-900">
                    {facility.name}
                  </div>
                  <div className="mt-1 text-sm text-neutral-700">
                    {facility.distance.toFixed(1)} km away · 👍{" "}
                    {facility.recommendationPercent}% recommended
                  </div>
                </div>
                <ChevronRight className="mt-2 h-5 w-5 text-neutral-700" />
              </div>

              <div className="mt-4 h-px w-full bg-neutral-400" />

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-warning-100 px-3 py-1 text-sm font-medium text-neutral-900">
                  {getTodayCloseLabel(facility)}
                </span>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-neutral-900">
                  {facility.acceptsBookings ? "Accepts bookings" : "Walk-in only"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
