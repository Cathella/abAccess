"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { transformVisitDataToWeeklyChart } from "@/lib/utils/visitChartData";
import { UserHeader } from "@/components/common/UserHeader";
import { WalletCard } from "@/components/cards/WalletCard";
import { DependentsCard } from "@/components/cards/DependentsCard";
import { PackagesCard } from "@/components/cards/PackagesCard";
import Link from "next/link";

const cards = {
  action: "border-[1.5px] border-neutral-300 rounded-[26px] bg-white",
  panel: "border-[1.5px] border-neutral-300 rounded-[26px] bg-white",
  pill: "inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-900",
  subtleButton:
    "inline-flex items-center justify-center rounded-full border border-neutral-900 bg-primary-100 px-6 py-2 text-base font-semibold text-neutral-900 hover:bg-primary-100/70",
};


export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboard(user?.id);
  const [selectedDependent, setSelectedDependent] = useState<string>("All");
  const [timeframe, setTimeframe] = useState<"This week" | "This month" | "Last 3 months">("This week");

  const greeting = useMemo(() => {
    if (!user) return "Good morning";
    return `Good morning, ${user.firstName}`;
  }, [user]);

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
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  if (dashboardError) {
    console.error("Dashboard error:", dashboardError);
  }

  return (
    <>
      <UserHeader greeting={greeting} memberId={user.memberId ? `ID: ${user.memberId}` : "ID: N/A"} />

      <div className="space-y-8 px-4 pb-8 pt-24 sm:px-6">
        {/* Wallet */}
        {dashboardData.walletBalance === 0 ? (
          // Empty wallet state - using WalletCard component
          <WalletCard
            balance={dashboardData.walletBalance}
            onTopUp={() => {
              // TODO: Implement top up functionality
              console.log("Top up clicked");
            }}
            className="mb-4"
          />
        ) : (
          // Wallet with balance
          <div className={cn(cards.panel, "p-5 rounded-[30px] mb-4")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-2xl">
                  <span role="img" aria-label="wallet">💰</span>
                </div>
                <div>
                  <p className="text-base font-normal text-neutral-900">Wallet</p>
                </div>
              </div>
              <div className="flex items-center">
                <Link href="#" className="text-base font-semibold text-secondary-900 underline">
                  Transaction History
                </Link>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[40px] font-semibold text-neutral-900 tracking-tight leading-none">
                  {dashboardData.walletBalance.toLocaleString()}
                </p>
                <p className="text-sm font-normal text-neutral-700 leading-none">UGX</p>
              </div>
              <button className="h-10 rounded-[14px] border-2 border-neutral-900 bg-[#37c189] px-5 text-base font-semibold text-neutral-900 hover:bg-[#2fa678]">
                Top up
              </button>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Dependents Card */}
          {dashboardData.familyMembersCount === 0 ? (
            <DependentsCard
              onAddDependent={() => {
                // TODO: Navigate to add dependent page
                console.log("Add dependent clicked");
              }}
            />
          ) : (
            <Link href="#" className={cn(cards.action, "p-4 relative overflow-hidden")}>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <span role="img" aria-label="dependents" className="text-3xl">❤️</span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="text-xl font-semibold text-neutral-900">
                    <span className="text-[20px] font-semibold">{dashboardData.familyMembersCount}</span> <span className="text-base font-normal">Dependents</span>
                  </p>
                  <span className="text-2xl text-neutral-900">›</span>
                </div>
              </div>
            </Link>
          )}

          {/* Packages Card */}
          {dashboardData.packagesCount === 0 ? (
            <PackagesCard
              onBrowsePackages={() => {
                // TODO: Navigate to packages page
                console.log("Browse packages clicked");
              }}
            />
          ) : (
            <Link href="#" className={cn(cards.action, "p-4 relative overflow-hidden")}>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <span role="img" aria-label="packages" className="text-3xl">📦</span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="text-xl font-semibold text-neutral-900">
                    <span className="text-[20px] font-semibold">{dashboardData.packagesCount}</span> <span className="text-base font-normal">Packages</span>
                  </p>
                  <span className="text-2xl text-neutral-900">›</span>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Partners */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Partners near you</h2>
            <Link href="#" className="text-base font-semibold text-secondary-900 underline">
              View all
            </Link>
          </div>

          <div className="rounded-[26px] border-[1.5px] border-neutral-300 p-4">
            <div className="flex gap-4 overflow-x-auto pb-0">
              {dashboardData.nearbyFacilities.length > 0 ? (
                dashboardData.nearbyFacilities.map((facility, idx) => (
                  <div
                    key={`${facility.id}-${idx}`}
                    className={cn(
                      cards.panel,
                      "min-w-[92%] max-w-[92%] space-y-4 rounded-[26px] border-none p-0"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-2xl">
                        <span role="img" aria-label="facility" className="text-2xl">🏥</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-neutral-900">{facility.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm font-normal text-neutral-600">{facility.address}</p>
                          {facility.accepts_booking && (
                            <span className="rounded-full px-3 py-1 text-sm font-semibold bg-[#d8f1dd] text-neutral-900">
                              Bookings available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <button className="w-full h-10 rounded-[14px] border-2 border-neutral-900 bg-[#e4eefd] px-4 text-base font-semibold text-neutral-900 hover:bg-[#d6e6fb]">
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
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
                className="appearance-none rounded-xl border-[1.5px] border-neutral-300 bg-white px-3 pr-8 py-2 text-sm font-normal text-neutral-900 focus:outline-none"
              >
                <option>This week</option>
                <option>This month</option>
                <option>Last 3 months</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-700" />
            </div>
          </div>

          <div className={cn(cards.panel, "p-4 space-y-4 bg-neutral-100")}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDependent("All")}
                className={cn(
                  "rounded-full px-2 text-sm h-6 flex items-center justify-center",
                  selectedDependent === "All"
                    ? "bg-primary-900 text-neutral-900 font-semibold"
                    : "bg-neutral-200 text-neutral-700 font-normal border-0"
                )}
              >
                All
              </button>
              {dashboardData.familyMembers.map((member) => {
                const isActive = selectedDependent === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedDependent(member.id)}
                    className={cn(
                      "rounded-full px-2 text-sm h-6 flex items-center justify-center",
                      isActive
                        ? "bg-primary-900 text-neutral-900 font-semibold"
                        : "bg-neutral-200 text-neutral-700 font-normal border-0"
                    )}
                  >
                    {member.name}
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
                    <div className="flex h-24 w-full items-end rounded-2xl bg-secondary-100/40 p-1">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-neutral-300 bg-white px-6 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </section>
      </div>
    </>
  );
}
