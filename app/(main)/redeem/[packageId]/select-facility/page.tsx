"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search, ChevronRight, Hospital } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useRedemptionStore } from "@/stores/redemptionStore";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type FacilityRow = Database["public"]["Tables"]["facilities"]["Row"];

type FacilityCard = FacilityRow & {
  distanceKm: number;
  recommendedPct: number;
};

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

function getTodayCloseLabel(operatingHours?: Record<string, { open?: string; close?: string }>) {
  if (!operatingHours) return "Open now";
  const key = DAY_KEYS[new Date().getDay()];
  const today = operatingHours[key];
  if (!today?.close) return "Open now";
  return `Closes ${formatTimeLabel(today.close)}`;
}

export default function SelectFacilityPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId as string;

  const { session, setSelectedFacility } = useRedemptionStore();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<FacilityCard[]>([]);

  useEffect(() => {
    if (!session || !session.selectedMemberId) {
      router.push(`/redeem/${packageId}/select-member`);
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

        const enriched = (data || []).map((facility: FacilityRow, index) => ({
          ...facility,
          distanceKm: Number((1.2 + index * 0.3).toFixed(1)),
          recommendedPct: 80 + ((index * 5) % 20),
        }));
        setFacilities(enriched);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacilities();
  }, [packageId, router, session]);

  const filteredFacilities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return facilities;
    return facilities.filter((facility) =>
      `${facility.name} ${facility.address}`.toLowerCase().includes(query)
    );
  }, [facilities, search]);

  const handleSelectFacility = (facility: FacilityCard) => {
    setSelectedFacility(facility.id, facility.name);
    router.push(`/redeem/${packageId}/confirm-copay`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Use Package" showBack />
      <div className="h-px bg-neutral-400" />

      <div className="flex-1 px-6 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Select a facility
        </h1>

        <div className="relative">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search facilities..."
            className="h-12 w-full rounded-2xl border border-neutral-300 bg-white px-4 pr-12 text-base text-neutral-900 placeholder:text-neutral-500 focus:border-primary-900 focus:outline-none"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
        </div>

        <div className="mt-6 space-y-4">
          {isLoading && (
            <div className="text-sm text-neutral-600">Loading facilities...</div>
          )}

          {!isLoading && filteredFacilities.length === 0 && (
            <div className="rounded-2xl border border-neutral-300 bg-neutral-100 p-6 text-center text-sm text-neutral-600">
              No facilities found.
            </div>
          )}

          {filteredFacilities.map((facility) => (
            <button
              key={facility.id}
              onClick={() => handleSelectFacility(facility)}
              className="w-full rounded-3xl border border-neutral-300 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <Hospital className="h-6 w-6 text-neutral-900" />
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-neutral-900">
                    {facility.name}
                  </div>
                  <div className="mt-1 text-sm text-neutral-600">
                    {facility.distanceKm} km away · 👍 {facility.recommendedPct}% recommended
                  </div>
                </div>
                <ChevronRight className="mt-2 h-5 w-5 text-neutral-400" />
              </div>

              <div className="mt-4 h-px w-full bg-neutral-200" />

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-neutral-900">
                  {getTodayCloseLabel(facility.operating_hours as any)}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-neutral-900">
                  {facility.accepts_booking ? "Accepts bookings" : "Walk-in only"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
