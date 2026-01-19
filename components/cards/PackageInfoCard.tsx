import type { UserPackageType } from "@/types";
import { formatPackageDate, getCategoryDisplayName } from "@/lib/packages";
import { StatusBadge } from "@/components/common/StatusBadge";
import { VisitBadges } from "@/components/common/VisitBadges";

interface PackageInfoCardProps {
  package: UserPackageType;
}

export function PackageInfoCard({ package: pkg }: PackageInfoCardProps) {
  const isCompleted = pkg.status === "completed";
  const isExpired = pkg.status === "expired";

  return (
    <div className="rounded-2xl border border-neutral-400 bg-white p-6">
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
      <div className="flex justify-center">
        {isCompleted ? (
          <StatusBadge status="completed" />
        ) : isExpired ? (
          <StatusBadge status="expired" />
        ) : (
          <VisitBadges
            total={pkg.totalVisits}
            used={pkg.usedVisits}
            remaining={pkg.remainingVisits}
          />
        )}
      </div>
    </div>
  );
}
