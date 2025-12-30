"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useFamilyStore } from "@/stores/familyStore";
import { ChevronDown, ChevronRight, Heart, Hospital, LogOut, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { transformVisitDataToWeeklyChart } from "@/lib/utils/visitChartData";
import { UserHeader } from "@/components/common/UserHeader";
import { WalletCard } from "@/components/cards/WalletCard";
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


export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch } = useDashboard(user?.id);
  const dependents = useFamilyStore((state) => state.dependents);
  const [selectedDependent, setSelectedDependent] = useState<string>("All");
  const [timeframe, setTimeframe] = useState<"This week" | "This month" | "Last 3 months">("This week");
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

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

  // Use familyStore data for dependents count
  const familyMembersCount = dependents.length;

  // Transform visit data into weekly chart format
  const weeklyChartData = useMemo(() => {
    return transformVisitDataToWeeklyChart(dashboardData.visitStats);
  }, [dashboardData.visitStats]);

  // Calculate total visits count
  const totalVisitsCount = useMemo(() => {
    return weeklyChartData.reduce((sum, day) => sum + day.value, 0);
  }, [weeklyChartData]);

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

  return (
    <>
      <UserHeader
        firstName={user.firstName}
        memberId={user.memberId ? `ID: ${user.memberId}` : "ID: N/A"}
        initials={initials}
        onNotificationsClick={() => router.push(ROUTES.NOTIFICATIONS)}
        onSettingsClick={() => router.push(ROUTES.PROFILE)}
      />

      <div className="space-y-8 px-4 pb-8 pt-24 sm:px-6">
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
                  <ChevronRight className="h-5 w-5 text-neutral-900" />
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
                <div className="flex min-w-full items-center justify-center py-8">
                  <p className="text-sm text-neutral-600">No partner facilities available yet</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Visit trends */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Your visit trends</h2>
            <div className="relative">
              <button
                onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                className="flex items-center gap-2 rounded-lg border-[1.5px] border-neutral-400 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors hover:bg-neutral-100"
              >
                {timeframe}
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showTimeframeDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowTimeframeDropdown(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-neutral-400 bg-white py-2 shadow-lg">
                    {(["This week", "This month", "Last 3 months"] as const).map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setTimeframe(option);
                            setShowTimeframeDropdown(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-neutral-900 transition-colors hover:bg-neutral-100"
                        >
                          {/* Radio button */}
                          <div
                            className={`h-5 w-5 rounded-full border-2 ${
                              timeframe === option
                                ? "border-secondary-900 bg-secondary-900"
                                : "border-neutral-400 bg-white"
                            } flex items-center justify-center`}
                          >
                            {timeframe === option && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={cn(cards.panel, "p-4 space-y-4 bg-neutral-100 rounded-4xl")}>
            <div className="flex flex-wrap gap-2">
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
              {dependents.map((dependent) => {
                const isActive = selectedDependent === dependent.id;
                return (
                  <button
                    key={dependent.id}
                    onClick={() => setSelectedDependent(dependent.id)}
                    className={cn(
                      "rounded-full px-2 text-sm h-6 flex items-center justify-center",
                      isActive
                        ? "bg-primary-700 text-neutral-900 font-semibold"
                        : "bg-neutral-200 text-neutral-700 font-normal border border-neutral-400"
                    )}
                  >
                    {dependent.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-end gap-3">
              {weeklyChartData.map((visit, idx) => {
                const maxVisits = 3;
                const heightPct = Math.min(visit.value, maxVisits) / maxVisits * 100;
                return (
                  <div key={`${visit.label}-${idx}`} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end rounded-2xl bg-secondary-100 p-1">
                      <div
                        className="w-full rounded-xl bg-secondary-900"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">{visit.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-900">
                {totalVisitsCount} {totalVisitsCount === 1 ? 'visit' : 'visits'} {timeframe.toLowerCase()}
              </p>
              <Link href="#" className="text-base font-semibold text-secondary-900 underline">
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
