"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { usePackageStore } from "@/stores/packageStore";
import { formatPackageDate, getCategoryDisplayName } from "@/lib/packages";

export default function PackageHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const userPackages = usePackageStore((state) => state.userPackages);
  const pkg = userPackages.find((p) => p.id === packageId);

  useEffect(() => {
    // If package not found, redirect to my-packages
    if (!pkg && userPackages.length > 0) {
      router.push("/my-packages");
    }
  }, [pkg, userPackages, router]);

  if (!pkg) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  // Sort usage history by date (newest first)
  const sortedHistory = [...pkg.usageHistory].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  return (
    <div className="flex min-h-screen flex-col bg-neutral-200">
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center gap-3 px-6 py-4">
          <button
            onClick={() => router.push(`/my-packages/${packageId}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-200 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6 text-neutral-900" />
          </button>
          <h1 className="text-[20px] font-bold text-neutral-900">
            Usage History
          </h1>
        </div>
        <div className="h-px bg-neutral-400" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {/* Package Summary Card */}
        <div className="rounded-xl bg-neutral-100 p-4">
          <h2 className="text-base font-bold text-neutral-900">
            {getCategoryDisplayName(pkg.package.category)}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
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
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100">
                  <span className="text-sm font-semibold text-secondary-900">
                    {visit.personInitials}
                  </span>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {visit.personName}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {visit.facilityName}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-neutral-200" />

              {/* Visit Details */}
              <div className="space-y-1">
                <p className="text-sm text-neutral-600">
                  Visited on: {formatPackageDate(visit.visitDate)}
                </p>
                <p className="text-sm text-neutral-600">
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
