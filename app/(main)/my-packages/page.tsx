"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePackageStore } from "@/stores/packageStore";
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
  const isLoading = usePackageStore((state) => state.isLoading);

  const greeting = useMemo(() => {
    if (!user) return "Good morning";
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user.firstName}`;
    if (hour < 18) return `Good afternoon, ${user.firstName}`;
    return `Good evening, ${user.firstName}`;
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  }, [user]);

  // Filter packages based on selected tab
  const filteredPackages = useMemo(() => {
    return userPackages.filter((pkg) => pkg.status === packageFilter);
  }, [userPackages, packageFilter]);

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
        greeting={greeting}
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
              <div className="mb-6 flex h-16 w-16 items-center justify-center">
                <span role="img" aria-label="package" className="text-[64px] leading-none">
                  📦
                </span>
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
