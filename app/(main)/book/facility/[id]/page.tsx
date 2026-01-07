"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Header } from "@/components/common/Header";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { useBookingStore } from "@/stores/bookingStore";
import { MOCK_FACILITIES } from "@/lib/constants";

export default function FacilityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params.id as string;

  const { session, setSelectedFacility } = useBookingStore();

  // Find facility by ID
  const facility = MOCK_FACILITIES.find((f) => f.id === facilityId);

  // Redirect if prerequisites not met
  useEffect(() => {
    if (!session.packageId || !session.memberId) {
      router.push("/book/select-package");
    }
  }, [session.packageId, session.memberId, router]);

  const handleGetDirections = () => {
    if (!facility) return;

    // Open Google Maps with facility address
    const encodedAddress = encodeURIComponent(facility.address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, "_blank");
  };

  const handleBookFacility = () => {
    if (!facility) return;

    // Save facility to booking store
    setSelectedFacility(facility);

    // Navigate to date/time selection
    router.push("/book/select-datetime");
  };

  if (!facility) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Facility not found</p>
      </div>
    );
  }

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
      <div className="flex-1 pb-32">
        {/* Hero Image */}
        <div className="w-full h-56 bg-linear-to-br from-primary-100 to-secondary-100 overflow-hidden">
          {facility.imageUrl ? (
            <img
              src={facility.imageUrl}
              alt={facility.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-500 text-sm">No image available</span>
            </div>
          )}
        </div>

        {/* Facility Info */}
        <div className="px-6 pt-6">
          {/* Name */}
          <h1 className="text-base font-bold text-neutral-900 mb-2">
            {facility.name}
          </h1>

          {/* Address + Distance */}
          <p className="text-sm text-neutral-700 mb-2">
            {facility.address} · {facility.distanceLabel}
          </p>

          {/* Recommendation Row */}
          <div className="flex items-center mb-6 border-t border-neutral-400 pt-2">
            <span className="text-green-600 text-sm font-medium">
              👍 {facility.recommendationPercent}% recommended
            </span>
            <span className="text-sm text-neutral-700 ml-1">
              · Based on {facility.patientVisits} patient visits
            </span>
          </div>

          {/* Hours Card */}
          <div className="rounded-4xl border border-neutral-400 bg-white p-4 mb-4">
            <h3 className="font-bold text-xl text-neutral-900 mb-3">Hours</h3>
            <div className="border-b border-neutral-400 mb-3" />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Monday - Friday</span>
                <span className="text-neutral-900 text-sm font-semibold bg-secondary-100 px-2 py-1 rounded-full">{facility.hours.weekdays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Saturday</span>
                <span className="text-neutral-900 text-sm font-semibold bg-secondary-100 px-2 py-1 rounded-full">{facility.hours.saturday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Sunday</span>
                <span className={facility.hours.sunday === "Closed" ? "text-error-900" : "text-neutral-900"}>
                  {facility.hours.sunday}
                </span>
              </div>
            </div>
          </div>

          {/* Services Card */}
          <div className="rounded-4xl bg-secondary-100 p-4">
            <h3 className="font-bold text-xl text-neutral-900 mb-3">Services</h3>
            <div className="border-b border-neutral-400 mb-3" />

            <div className="space-y-2">
              {facility.services.map((service) => (
                <div key={service} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" strokeWidth={2.5} />
                  <span className="text-neutral-900">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-400 px-6 py-4 space-y-3">
        {/* Get Directions Link */}
        <div className="text-center">
          <button
            onClick={handleGetDirections}
            className="text-secondary-900 font-semibold hover:underline"
          >
            Get directions
          </button>
        </div>

        {/* Book Button */}
        <PrimaryButton onClick={handleBookFacility}>
          Book at this facility
        </PrimaryButton>
      </div>
    </div>
  );
}
