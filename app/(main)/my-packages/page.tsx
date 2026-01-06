"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePackageStore } from "@/stores/packageStore";
import { useVisitsStore } from "@/stores/visitsStore";
import { UserHeader } from "@/components/common/UserHeader";
import { TabFilter } from "@/components/packages/TabFilter";
import { PackageCard } from "@/components/packages/PackageCard";
import { ROUTES } from "@/lib/constants";

export default function MyPackagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userPackages = usePackageStore((state) => state.userPackages);
  const packageFilter = usePackageStore((state) => state.packageFilter);
  const setPackageFilter = usePackageStore((state) => state.setPackageFilter);
  const loadUserPackages = usePackageStore((state) => state.loadUserPackages);
  const visits = useVisitsStore((state) => state.visits);
  const loadVisits = useVisitsStore((state) => state.loadVisits);

  useEffect(() => {
    if (!user?.id) return;
    loadUserPackages(user.id, { force: true });
  }, [loadUserPackages, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    loadVisits(user.id, { force: true });
  }, [loadVisits, user?.id]);

  const initials = useMemo(() => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  }, [user]);

  const packagesWithCompletedDates = useMemo(() => {
    if (visits.length === 0) return userPackages;

    return userPackages.map((pkg) => {
      if (pkg.status !== "completed" || pkg.completedDate) {
        return pkg;
      }

      const latestVisit = visits
        .filter((visit) => visit.packageId === pkg.id)
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0];

      if (!latestVisit) return pkg;

      return {
        ...pkg,
        completedDate: latestVisit.visitDate,
      };
    });
  }, [userPackages, visits]);

  // Filter packages based on selected tab
  const filteredPackages = useMemo(() => {
    return packagesWithCompletedDates.filter((pkg) => pkg.status === packageFilter);
  }, [packagesWithCompletedDates, packageFilter]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
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

      <div className="flex flex-1 flex-col">
        {userPackages.length === 0 ? (
          // Empty State
          <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center">
            <div className="flex max-w-75 flex-col items-center text-center">
              {/* Package Icon */}
              <div className="mb-6 flex text-4xl items-center justify-center">
                📦
              </div>

              {/* Title */}
              <h1 className="mb-3 text-xl font-bold text-neutral-900">
                No packages yet
              </h1>

              {/* Description */}
              <p className="mb-8 text-base leading-[160%] text-neutral-600">
                Purchase a package to start saving on healthcare visits for you and your family.
              </p>

              {/* Browse Packages Button */}
              <button
                onClick={() => router.push(ROUTES.PACKAGES)}
                className="rounded-xl border-[1.5px] border-neutral-900 bg-primary-100 px-6 h-10 text-base font-bold text-neutral-900 transition-colors hover:bg-neutral-50"
              >
                Browse packages
              </button>
            </div>
          </div>
        ) : (
          // Packages List
          <div className="min-h-[calc(100vh-80px)] px-4 pb-8 pt-24">
            {/* Section Title Row */}
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-neutral-900">My packages</h2>
              <button
                onClick={() => router.push(ROUTES.PACKAGES)}
                className="rounded-xl bg-primary-900 px-5 h-10 text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-primary-800"
              >
                Add Package
              </button>
            </div>

            {/* Tab Filters */}
            <TabFilter activeTab={packageFilter} onTabChange={setPackageFilter} />

            {/* Package Cards */}
            <div className="mt-2">
              {filteredPackages.length === 0 ? (
                <div className="mt-8 text-center">
                  <p className="text-sm text-neutral-600">
                    No {packageFilter} packages
                  </p>
                </div>
              ) : (
                filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
