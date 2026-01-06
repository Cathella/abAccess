"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useVisitsStore } from "@/stores/visitsStore";
import { useBookingStore } from "@/stores/bookingStore";
import { UserHeader } from "@/components/common/UserHeader";
import { VisitTabFilter } from "@/components/common/VisitTabFilter";
import { MemberFilterDropdownConnected } from "@/components/common/MemberFilterDropdownConnected";
import { MonthGroupHeader } from "@/components/common/MonthGroupHeader";
import { VisitsEmptyState } from "@/components/common/VisitsEmptyState";
import { VisitCard } from "@/components/cards/VisitCard";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function VisitsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Booking store
  const startBooking = useBookingStore((state) => state.startBooking);

  // Visits store
  const visits = useVisitsStore((state) => state.visits);
  const activeTab = useVisitsStore((state) => state.activeTab);
  const selectedMemberId = useVisitsStore((state) => state.selectedMemberId);
  const setActiveTab = useVisitsStore((state) => state.setActiveTab);
  const setSelectedMemberId = useVisitsStore((state) => state.setSelectedMemberId);
  const getFilteredVisits = useVisitsStore((state) => state.getFilteredVisits);
  const getVisitsByTab = useVisitsStore((state) => state.getVisitsByTab);
  const groupVisitsByMonth = useVisitsStore((state) => state.groupVisitsByMonth);
  const loadVisits = useVisitsStore((state) => state.loadVisits);

  useEffect(() => {
    if (!user?.id) return;
    loadVisits(user.id, { force: true });
  }, [loadVisits, user?.id]);

  // User initials for header
  const initials = useMemo(() => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  }, [user]);

  // Get filtered visits
  const filteredVisits = getFilteredVisits();

  // Calculate counts for tab badges
  const tabCounts = useMemo(() => ({
    upcoming: getVisitsByTab('upcoming').length,
    completed: getVisitsByTab('completed').length,
    canceled: getVisitsByTab('canceled').length,
  }), [getVisitsByTab]);

  // Group visits by month for completed tab
  const groupedVisits = useMemo(() => {
    if (activeTab === 'completed') {
      return groupVisitsByMonth(filteredVisits);
    }
    return {};
  }, [activeTab, filteredVisits, groupVisitsByMonth]);

  // Check if user has any visits at all
  const hasAnyVisits = visits.length > 0;

  // Check if filtered list is empty
  const hasFilteredVisits = filteredVisits.length > 0;

  // Handle book a visit
  const handleBookVisit = () => {
    startBooking();
    router.push('/book/select-package');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-700">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <UserHeader
        firstName={user.firstName}
        memberId={user.memberId ? `ID: ${user.memberId}` : "ID: N/A"}
        initials={initials}
        onNotificationsClick={() => router.push(ROUTES.NOTIFICATIONS)}
        onSettingsClick={() => router.push(ROUTES.PROFILE)}
      />

      {/* Main Content */}
      <div className="px-4 py-8"> 
        {!hasAnyVisits ? (
          // Show empty state if user has no visits at all
          <VisitsEmptyState />
        ) : (
          <div className="space-y-4">
            {/* Title + Book a Visit Button Row */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-neutral-900">Visits</h1>
              <Button
                onClick={handleBookVisit}
                className="bg-primary-900 hover:bg-primary-800 text-neutral-900 rounded-xl px-4 py-2 font-bold text-base border-[1.5px] border-neutral-900 h-10"
              >
                Book a Visit
              </Button>
            </div>

            {/* Tab Filter */}
            <VisitTabFilter
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={tabCounts}
            />

            {/* Filter Row */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-bold text-neutral-700">Filter</span>
              <div className="flex-1 max-w-xs">
                <MemberFilterDropdownConnected
                  selectedMemberId={selectedMemberId}
                  onSelect={setSelectedMemberId}
                />
              </div>
            </div>

            {/* Visits List */}
            {!hasFilteredVisits ? (
              // Show "no visits for this filter" message
              <div className="flex flex-1 items-center justify-center py-16 text-center">
                <p className="text-base text-neutral-700">
                  No {activeTab} visits
                  {selectedMemberId !== 'all' && ' for selected member'}
                </p>
              </div>
            ) : activeTab === 'completed' ? (
              // Completed tab: Group by month
              <div className="space-y-6">
                {Object.entries(groupedVisits).map(([month, monthVisits]) => (
                  <div key={month} className="space-y-3">
                    <MonthGroupHeader month={month} />
                    <div className="space-y-3">
                      {monthVisits.map((visit) => (
                        <VisitCard
                          key={visit.id}
                          visit={visit}
                          onPress={() => {
                            // Navigate to visit detail page
                            router.push(`/visits/${visit.id}`);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Upcoming/Canceled tabs: Flat list
              <div className="space-y-3">
                {filteredVisits.map((visit) => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    onPress={() => {
                      // Navigate to visit detail page
                      router.push(`/visits/${visit.id}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
