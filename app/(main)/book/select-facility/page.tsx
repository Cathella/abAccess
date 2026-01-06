"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Header } from "@/components/common/Header";
import { Input } from "@/components/ui/input";
import { FacilityCard } from "@/components/cards/FacilityCard";
import { useBookingStore } from "@/stores/bookingStore";
import { MOCK_FACILITIES } from "@/lib/constants";
import type { BookingFacility } from "@/types";

export default function SelectFacilityPage() {
  const router = useRouter();

  const { session, setSelectedFacility, canProceedToDateTime } = useBookingStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!session.packageId || !session.memberId) {
      router.push("/book/select-package");
    }
  }, [session.packageId, session.memberId, router]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get category name from package
  const getCategoryName = (categoryEnum: string): string => {
    const categoryMap: Record<string, string> = {
      consultations: "Consultations",
      childWellness: "Child Wellness",
      maternity: "Maternal Care",
      labTests: "Lab Tests",
      dental: "Dental",
      optical: "Optical",
    };
    return categoryMap[categoryEnum] || "";
  };

  const packageCategory = session.package?.package?.category
    ? getCategoryName(session.package.package.category)
    : "";

  // Filter and sort facilities
  const filteredFacilities = useMemo<BookingFacility[]>(() => {
    let facilities = [...MOCK_FACILITIES];

    // Filter by package category - facility must support the service
    if (packageCategory) {
      facilities = facilities.filter((facility) =>
        facility.services.some((service) =>
          service.toLowerCase().includes(packageCategory.toLowerCase()) ||
          packageCategory.toLowerCase().includes(service.toLowerCase())
        )
      );
    }

    // Filter by search query (name or address)
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      facilities = facilities.filter(
        (facility) =>
          facility.name.toLowerCase().includes(query) ||
          facility.address.toLowerCase().includes(query)
      );
    }

    // Sort by distance (nearest first)
    facilities.sort((a, b) => a.distance - b.distance);

    return facilities;
  }, [debouncedQuery, packageCategory]);

  const handleSelectFacility = (facility: BookingFacility) => {
    // Save to booking store
    setSelectedFacility(facility);

    // Navigate to facility detail page
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
      {/* Header */}
      <Header title="Book a visit" showBack={true} />

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">
          Select a facility
        </h1>

        {/* Search Input */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 rounded-xl border-neutral-400"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Facility List */}
        {filteredFacilities.length > 0 ? (
          <div className="space-y-3">
            {filteredFacilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onPress={() => handleSelectFacility(facility)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-neutral-600 mb-2">No facilities found</p>
            <p className="text-sm text-neutral-500">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
