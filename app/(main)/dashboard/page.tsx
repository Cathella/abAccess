"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useVisitsStore } from "@/stores/visitsStore";
import { usePendingApprovalsStore } from "@/stores/pendingApprovalsStore";
import { ChevronLeft, ChevronRight, Heart, Hospital, LogOut, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { transformVisitDataToWeeklyChart } from "@/lib/utils/visitChartData";
import { UserHeader } from "@/components/common/UserHeader";
import { PartnersEmptyState } from "@/components/common/PartnersEmptyState";
import { WalletCard } from "@/components/cards/WalletCard";
import { ApprovalBanner } from "@/components/cards/ApprovalBanner";
import { DependentsCard } from "@/components/cards/DependentsCard";
import { PackagesCard } from "@/components/cards/PackagesCard";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const cards = {
  action: "border border-neutral-400 rounded-4xl bg-white",
  panel: "border border-neutral-400 rounded-xl bg-white",
  pill: "inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-900",
  subtleButton:
    "inline-flex items-center justify-center rounded-full border border-neutral-900 bg-primary-100 px-6 py-2 text-base font-semibold text-neutral-900 hover:bg-primary-100/70",
};

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch } = useDashboard(user?.id);
  const visits = useVisitsStore((state) => state.visits);
  const loadVisits = useVisitsStore((state) => state.loadVisits);
  const { pendingRequests, getPendingCount, loadPendingRequests } = usePendingApprovalsStore();
  const [selectedDependent, setSelectedDependent] = useState<string>("All");
  const [weekOffset, setWeekOffset] = useState(0);

  const initials = useMemo(() => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  }, [user]);

  // Refetch dashboard data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch]);

  useEffect(() => {
    if (!user?.id) return;
    loadVisits(user.id, { force: true });
  }, [loadVisits, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    loadPendingRequests(user.id);
  }, [loadPendingRequests, user?.id]);

  const dependents = dashboardData.familyMembers;
  const familyMembersCount = dashboardData.familyMembersCount;

  const chartMembers = useMemo(() => {
    const members = [{ id: user?.id || "self", name: "Me" }];
    dependents.forEach((dependent) => {
      members.push({ id: dependent.id, name: dependent.name });
    });
    return members;
  }, [dependents, user?.id]);

  const weekRange = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    const dayOfWeek = startDate.getDay();
    const mondayOffset = (dayOfWeek + 6) % 7;
    startDate.setDate(startDate.getDate() - mondayOffset + weekOffset * 7);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const format = (date: Date) =>
      date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    return {
      startDate,
      endDate,
      label: `${format(startDate)} - ${format(endDate)}`,
    };
  }, [weekOffset]);

  const filteredVisits = useMemo(() => {
    const startKey = getLocalDateKey(weekRange.startDate);
    const endKey = getLocalDateKey(weekRange.endDate);

    return visits.filter((visit) => {
      if (selectedDependent !== "All" && visit.memberId !== selectedDependent) {
        return false;
      }

      const visitKey = getLocalDateKey(new Date(visit.visitDate));
      return visitKey >= startKey && visitKey <= endKey;
    });
  }, [selectedDependent, visits, weekRange.endDate, weekRange.startDate]);

  const visitStats = useMemo(() => {
    return filteredVisits.reduce((acc: Record<string, number>, visit) => {
      const dateKey = getLocalDateKey(new Date(visit.visitDate));
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});
  }, [filteredVisits]);

  // Transform visit data into weekly chart format
  const weeklyChartData = useMemo(() => {
    const stats = Object.entries(visitStats).map(([date, count]) => ({
      date,
      count,
    }));

    return transformVisitDataToWeeklyChart(stats, weekRange.startDate);
  }, [visitStats, weekRange.startDate]);

  // Calculate total visits count
  const totalVisitsCount = useMemo(() => {
    return weeklyChartData.reduce((sum, day) => sum + day.value, 0);
  }, [weeklyChartData]);

  const selectedDependentName = useMemo(() => {
    if (selectedDependent === "All") return "All";
    if (selectedDependent === user?.id) {
      return user?.firstName || "Me";
    }
    const dependent = dependents.find((member) => member.id === selectedDependent);
    return dependent?.name || "Member";
  }, [dependents, selectedDependent, user?.firstName, user?.id]);

  const maxVisits = 5;

  const chartTicks = [0, 1, 2, 3, 4, 5];

  const highlightIndex = useMemo(() => {
    if (weeklyChartData.length === 0) return -1;

    if (filteredVisits.length > 0) {
      const latestVisit = filteredVisits.reduce((latest, current) =>
        new Date(current.visitDate) > new Date(latest.visitDate) ? current : latest
      );
      const latestKey = getLocalDateKey(new Date(latestVisit.visitDate));
      const index = weeklyChartData.findIndex((point) => point.dateKey === latestKey);
      if (index >= 0 && weeklyChartData[index].value > 0) {
        return index;
      }
    }

    const maxValue = Math.max(...weeklyChartData.map((point) => point.value));
    return weeklyChartData.findIndex((point) => point.value === maxValue);
  }, [filteredVisits, weeklyChartData]);

  if (!user || dashboardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-primary-900">Loading your health data...</p>
      </div>
    );
  }

  if (dashboardError) {
    console.error("Dashboard error:", dashboardError);
  }

  const pendingCount = getPendingCount();
  const pendingList = pendingRequests.filter((request) => request.status === "pending");

  const handleBannerTap = () => {
    if (pendingCount === 1 && pendingList[0]) {
      router.push(`/approvals/${pendingList[0].id}`);
    } else {
      router.push("/approvals");
    }
  };

  return (
    <>
      <UserHeader
        firstName={user.firstName}
        memberId={user.memberId ? `ID: ${user.memberId}` : "ID: N/A"}
        initials={initials}
        onNotificationsClick={() => router.push(ROUTES.NOTIFICATIONS)}
        onSettingsClick={() => router.push(ROUTES.PROFILE)}
      />

      <div className="space-y-8 px-4 pt-24 pb-8 sm:px-6">
        {pendingCount > 0 && (
          <ApprovalBanner
            pendingCount={pendingCount}
            singleRequest={pendingCount === 1 ? pendingList[0] : undefined}
            onTap={handleBannerTap}
          />
        )}

        {/* Wallet */}
        {dashboardData.transactionCount === 0 ? (
          // Empty wallet state - no transactions yet
          <WalletCard
            balance={dashboardData.walletBalance}
            onTopUp={() => {
              router.push("/wallet/top-up");
            }}
            className="mb-4"
          />
        ) : (
          // Wallet with transactions (even if balance is 0)
          <div className={cn(cards.panel, "p-4 rounded-4xl mb-4")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
                  <Wallet className="h-6 w-6 text-neutral-900" />
                </div>
                <div>
                  <p className="text-base font-normal text-neutral-900">Wallet</p>
                </div>
              </div>
              <div className="flex items-center">
                <Link href="/wallet/history" className="text-base font-semibold text-secondary-900 underline">
                  Transaction History
                </Link>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[24px] font-bold text-neutral-900 tracking-tight leading-none">
                  {dashboardData.walletBalance.toLocaleString('en-UG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm font-normal text-neutral-700 leading-none">UGX</p>
              </div>
              <button
                onClick={() => router.push("/wallet/top-up")}
                className="h-10 rounded-[14px] border-2 border-neutral-900 bg-[#37c189] px-5 text-base font-semibold text-neutral-900 hover:bg-[#2fa678]"
              >
                Top up
              </button>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Dependents Card */}
          {familyMembersCount === 0 ? (
            <DependentsCard
              onAddDependent={() => {
                window.location.href = ROUTES.FAMILY_ADD;
              }}
            />
          ) : (
            <Link href={ROUTES.FAMILY} className={cn(cards.action, "p-4 relative overflow-hidden")}>
              <div className="flex flex-col items-center gap-1">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
                  <Heart className="h-6 w-6 text-neutral-900" />
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="font-medium text-sm text-neutral-900">
                    {familyMembersCount} Dependents
                  </p>
                  <ChevronRight className="h-5 w-5 text-neutral-700" />
                </div>
              </div>
            </Link>
          )}

          {/* Packages Card */}
          <PackagesCard />
        </div>

        {/* Partners */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Partners near you</h2>
            <Link href="#" className="text-base font-semibold text-secondary-900 underline">
              View all
            </Link>
          </div>

          <div className="">
            <div className="flex gap-6 overflow-x-auto pt-4">
              {dashboardData.nearbyFacilities.length > 0 ? (
                dashboardData.nearbyFacilities.map((facility, idx) => (
                  <div
                    key={`${facility.id}-${idx}`}
                    className={cn(
                      cards.panel,
                      "min-w-[70%] max-w-[70%] space-y-4 rounded-[26px] border-none p-0"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200 text-2xl">
                        <span role="img" aria-label="facility" className="text-2xl">
                          <Hospital className="h-6 w-6 text-neutral-900" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-base font-medium text-neutral-900">{facility.name}</p>
                        <p className="truncate mb-2 text-sm text-neutral-700">{facility.address}</p>
                        {facility.accepts_booking && (
                            <span className="rounded-full px-3 py-1 text-sm bg-secondary-100 text-neutral-900">
                              Bookings available
                            </span>
                        )}
                      </div>
                    </div>

                    <div className="">
                      <button className="w-full h-10 rounded-xl border-[1.5px] border-neutral-900 bg-primary-100 px-4 text-base font-semibold text-neutral-900">
                        Book a Visit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <PartnersEmptyState
                  onEnableLocation={() => {
                    // TODO: Implement location request
                    console.log("Enable location requested");
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* Visit trends */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Your visit trends</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-400 bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-medium text-neutral-700">{weekRange.label}</div>
              <button
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-400 bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className={cn(cards.panel, "p-4 space-y-4 bg-neutral-100 rounded-4xl")}>
            <div className="flex flex-wrap gap-2 pb-3">
              <button
                onClick={() => setSelectedDependent("All")}
                className={cn(
                  "rounded-full px-2 text-sm h-6 flex items-center justify-center",
                  selectedDependent === "All"
                    ? "bg-primary-700 text-neutral-900 font-semibold"
                    : "bg-neutral-200 text-neutral-700 font-normal border-0"
                )}
              >
                All
              </button>
              {chartMembers.map((member) => {
                const isActive = selectedDependent === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedDependent(member.id)}
                    className={cn(
                      "rounded-full px-2 text-sm h-6 flex items-center justify-center",
                      isActive
                        ? "bg-primary-700 text-neutral-900 font-semibold"
                        : "bg-neutral-200 text-neutral-700 font-normal border border-neutral-400"
                    )}
                  >
                    {member.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-end gap-3">
              <div className="relative h-40 w-6 pr-2 text-xs font-medium text-neutral-600">
                {chartTicks.map((tick) => (
                  <span
                    key={`tick-${tick}`}
                    className="absolute right-0 translate-y-0"
                    style={{ bottom: `${(tick / maxVisits) * 100}%` }}
                  >
                    {tick}
                  </span>
                ))}
              </div>

              <div className="relative flex h-40 w-full flex-col justify-end">
                <div className="absolute inset-0">
                  {chartTicks.map((tick) => (
                    <div
                      key={`grid-${tick}`}
                      className="absolute w-full border-b border-dashed border-neutral-300/70"
                      style={{ bottom: `${(tick / maxVisits) * 100}%` }}
                    />
                  ))}
                </div>

                <div
                  className="relative z-10 flex items-end gap-3"
                  style={{ top: 36 }}
                >
                  {weeklyChartData.map((visit, idx) => {
                    const heightPct = (visit.value / maxVisits) * 100;
                    const isHighlight = idx === highlightIndex && visit.value > 0;
                    return (
                      <div key={`${visit.label}-${idx}`} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex h-40 w-full items-end">
                          <div
                            className={`w-full rounded-2xl ${
                              isHighlight ? "bg-secondary-900" : "bg-secondary-100"
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 mt-2">{visit.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-14">
              <p className="text-sm text-neutral-900">
                {selectedDependentName}: {totalVisitsCount} {totalVisitsCount === 1 ? "visit" : "visits"} · {weekRange.label}
              </p>
              <Link href="/visits" className="text-base font-semibold text-secondary-900 underline">
                View all
              </Link>
            </div>
          </div>
        </section>

        {/* Sign Out Button */}
        <section className="pb-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl h-12 border border-neutral-400 bg-white text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </section>
      </div>
    </>
  );
}
