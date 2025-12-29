"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, BarChart3, Check, XCircle } from "lucide-react";
import { usePackageStore } from "@/stores/packageStore";
import { formatPackageDate, getCategoryDisplayName, getPackageDisplayInfo, getVisitsForfeited } from "@/lib/packages";
import { UsageHistoryCard } from "@/components/packages/UsageHistoryCard";

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const userPackages = usePackageStore((state) => state.userPackages);
  const pkg = userPackages.find((p) => p.id === packageId);

  // Calculate display info for banners
  const displayInfo = pkg ? getPackageDisplayInfo(pkg) : null;
  const isCompleted = pkg?.status === 'completed';
  const isExpired = pkg?.status === 'expired';
  const showExpiringSoon = displayInfo?.isExpiringSoon && pkg?.status === 'active';
  const showLowVisits = displayInfo?.isLowVisits && pkg?.status === 'active' && !showExpiringSoon;

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

  return (
    <div className="flex min-h-screen flex-col bg-neutral-200">
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center gap-3 px-6 py-4">
          <button
            onClick={() => router.push("/my-packages")}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-200 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6 text-neutral-900" />
          </button>
          <h1 className="text-[20px] font-bold text-neutral-900">
            {pkg.totalVisits} Visits Pack
          </h1>
        </div>
        <div className="h-px bg-neutral-400" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-32">
        {/* Expiring Soon Banner */}
        {showExpiringSoon && (
          <div className="mt-6 rounded-xl bg-error-100 px-4 py-3">
            <p className="text-center text-sm font-semibold text-error-900">
              Expiring soon
            </p>
          </div>
        )}

        {/* Low Visits Banner */}
        {showLowVisits && (
          <div className="mt-6 rounded-xl bg-warning-100 px-4 py-3">
            <p className="text-center text-sm font-semibold text-neutral-900">
              Only 1 visit left
            </p>
          </div>
        )}

        {/* Package Info Card */}
        <div className={`${showExpiringSoon || showLowVisits ? 'mt-4' : 'mt-6'} rounded-2xl border border-neutral-400 bg-white p-6`}>
          {/* Package Name */}
          <h2 className="mb-2 text-center text-[20px] font-bold text-neutral-900">
            {getCategoryDisplayName(pkg.package.category)}
          </h2>

          {/* Dates */}
          <p className="mb-4 text-center text-sm text-neutral-600">
            Purchased: {formatPackageDate(pkg.purchaseDate)}
            {isCompleted && pkg.completedDate
              ? ` · Completed: ${formatPackageDate(pkg.completedDate)}`
              : isExpired
              ? ` · Expired: ${formatPackageDate(pkg.expiryDate)}`
              : ` · Expires: ${formatPackageDate(pkg.expiryDate)}`}
          </p>

          {/* Divider */}
          <div className="mb-4 h-px bg-neutral-400" />

          {/* Status Badge or Visit Badges */}
          {isCompleted ? (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 rounded-[20px] bg-neutral-200 px-4 py-2">
                <Check className="h-4 w-4 text-neutral-900" />
                <span className="text-sm font-medium text-neutral-900">
                  Completed
                </span>
              </div>
            </div>
          ) : isExpired ? (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 rounded-[20px] bg-neutral-200 px-4 py-2">
                <XCircle className="h-4 w-4 text-neutral-900" />
                <span className="text-sm font-medium text-neutral-900">
                  Expired
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div className="rounded-lg bg-secondary-100 px-3 py-1.5">
                <span className="text-xs font-medium text-secondary-900">
                  Visits: {pkg.totalVisits}
                </span>
              </div>
              <div className="rounded-lg bg-neutral-200 px-3 py-1.5">
                <span className="text-xs font-medium text-neutral-900">
                  Used: {pkg.usedVisits}
                </span>
              </div>
              <div className="rounded-lg bg-warning-100 px-3 py-1.5">
                <span className="text-xs font-medium text-warning-900">
                  Remaining: {pkg.remainingVisits}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Co-pay Card (Reminder for active, Total for completed, Warning for expired) */}
        {isCompleted ? (
          <div className="mt-4 rounded-xl bg-primary-100 p-4">
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              Total co-pay paid
            </h3>
            <div className="mb-2 h-px bg-primary-200" />
            <p className="text-sm text-neutral-700">
              UGX {displayInfo?.totalCopayPaid.toLocaleString()} ({pkg.usedVisits} visit{pkg.usedVisits !== 1 ? 's' : ''})
            </p>
          </div>
        ) : isExpired ? (
          <div className="mt-4 rounded-xl bg-error-100 p-4">
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              This package has expired
            </h3>
            <div className="mb-2 h-px bg-error-200" />
            <p className="text-sm text-neutral-700">
              {getVisitsForfeited(pkg)} unused visit{getVisitsForfeited(pkg) !== 1 ? 's were' : ' was'} forfeited
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-primary-100 p-4">
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              Co-pay reminder
            </h3>
            <div className="mb-2 h-px bg-primary-200" />
            <p className="text-sm leading-[160%] text-neutral-700">
              You&apos;ll pay UGX {pkg.package.copay.toLocaleString()} at the facility
              during each visit.
            </p>
          </div>
        )}

        {/* Usage History Section */}
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">
              Usage history
            </h3>
            {pkg.usageHistory.length > 1 && (
              <button
                onClick={() => router.push(`/my-packages/${pkg.id}/history`)}
                className="text-sm font-medium text-secondary-900 transition-colors hover:text-secondary-800"
              >
                View all
              </button>
            )}
          </div>

          {/* Show Usage History or Empty State */}
          {pkg.usageHistory.length > 0 ? (
            <UsageHistoryCard packageId={pkg.id} usageHistory={pkg.usageHistory} />
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-400 bg-white px-8 py-8">
              {/* Chart Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center">
                <BarChart3 className="h-12 w-12 text-neutral-600" />
              </div>

              {/* Title */}
              <h4 className="mb-2 text-base font-semibold text-neutral-900">
                No visits yet!
              </h4>

              {/* Description */}
              <p className="mb-4 text-center text-sm text-neutral-600">
                Use this package at any of our {pkg.package.facilities} partner clinics.
              </p>

              {/* Book a Visit Button */}
              <button
                onClick={() => router.push(`/visits/book?packageId=${pkg.id}`)}
                className="rounded-xl border border-neutral-900 bg-transparent px-5 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
              >
                Book a Visit
              </button>
            </div>
          )}

          {/* Buy Another Package Link - Show when low visits */}
          {showLowVisits && (
            <button
              onClick={() => router.push("/packages")}
              className="mt-4 w-full text-center text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-700"
            >
              Buy another package
            </button>
          )}
        </div>
      </div>

      {/* Bottom Fixed Button */}
      {!isCompleted && !isExpired && (
        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4">
          <button
            onClick={() => router.push(`/redeem?packageId=${pkg.id}`)}
            className="w-full rounded-2xl bg-primary-900 py-4 text-base font-medium text-white transition-colors hover:bg-primary-800"
          >
            Use now
          </button>
        </div>
      )}

      {/* Buy Again Button for Completed/Expired Packages */}
      {(isCompleted || isExpired) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4">
          <button
            onClick={() => router.push(`/packages/${pkg.packageId}/purchase`)}
            className="w-full h-14 rounded-2xl bg-primary-900 text-base font-medium text-white transition-colors hover:bg-primary-800"
          >
            Buy this package again
          </button>
        </div>
      )}
    </div>
  );
}
