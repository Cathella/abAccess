"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { usePackageStore } from "@/stores/packageStore";
import { useVisitsStore } from "@/stores/visitsStore";
import { formatPackageDate, getCategoryDisplayName } from "@/lib/packages";

export default function PackageHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const userPackages = usePackageStore((state) => state.userPackages);
  const visits = useVisitsStore((state) => state.visits);
  const loadVisits = useVisitsStore((state) => state.loadVisits);
  const pkg = userPackages.find((p) => p.id === packageId);

  useEffect(() => {
    // If package not found, redirect to my-packages
    if (!pkg && userPackages.length > 0) {
      router.push("/my-packages");
    }
  }, [pkg, userPackages, router]);

  useEffect(() => {
    if (!user?.id) return;
    loadVisits(user.id, { force: true });
  }, [loadVisits, user?.id]);

  if (!pkg) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  const sortedHistory = useMemo(() => {
    const matchingVisits = visits
      .filter((visit) => visit.packageId === pkg.id)
      .map((visit) => ({
        id: visit.id,
        userPackageId: pkg.id,
        personName: visit.memberName,
        personInitials: visit.memberInitials,
        facilityName: visit.facilityName,
        visitDate: visit.visitDate,
        copayPaid: visit.copayAmount ?? 0,
      }));

    const usageHistory = matchingVisits.length > 0 ? matchingVisits : pkg.usageHistory;
    return [...usageHistory].sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
  }, [pkg, visits]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {/* Package Summary Card */}
        <div className="">
          <h2 className="text-xl font-bold text-neutral-900 text-center">
            {getCategoryDisplayName(pkg.package.category)}
          </h2>
          <p className="flex items-center justify-center mt-1 text-sm text-neutral-700">
            {pkg.totalVisits} visits · {pkg.usedVisits} used · {pkg.remainingVisits} remaining
          </p>
        </div>

        {/* Visit List */}
        <div className="mt-6 space-y-3">
          {sortedHistory.map((visit) => (
            <button
              key={visit.id}
              onClick={() => router.push(`/visits/${visit.id}`)}
              className="w-full rounded-2xl border border-neutral-400 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
            >
              {/* Avatar + Name + Facility */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100">
                  <span className="text-sm font-semibold text-neutral-900">
                    {visit.personInitials}
                  </span>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {visit.personName}
                  </h3>
                  <p className="text-sm mt-1 text-neutral-700">
                    {visit.facilityName}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-neutral-400" />

              {/* Visit Details */}
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <p className="">
                  Visited on: {formatPackageDate(visit.visitDate)}
                </p>
                <p>·</p>
                <p className="">
                  Co-paid: UGX {visit.copayPaid.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
