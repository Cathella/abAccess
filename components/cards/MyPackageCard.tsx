"use client";

import type { UserPackageType } from "@/types";
import { formatPackageDate, getCategoryDisplayName, getVisitsForfeited } from "@/lib/packages";
import { StatusBadge } from "@/components/common/StatusBadge";
import { VisitBadges } from "@/components/common/VisitBadges";
import {
  Stethoscope,
  FlaskConical,
  Pill,
  UserRound,
  Eye,
  Baby,
  ChevronRight,
} from "lucide-react";

interface MyPackageCardProps {
  package: UserPackageType;
  onPress: () => void;
}

function getCategoryIcon(category: string) {
  const iconClass = "h-6 w-6 text-primary-900";

  switch (category) {
    case "consultations":
      return <Stethoscope className={iconClass} />;
    case "lab_tests":
      return <FlaskConical className={iconClass} />;
    case "pharmacy":
      return <Pill className={iconClass} />;
    case "dental":
      return <UserRound className={iconClass} />;
    case "optical":
      return <Eye className={iconClass} />;
    case "maternity":
      return <Baby className={iconClass} />;
    default:
      return <Stethoscope className={iconClass} />;
  }
}

export function MyPackageCard({ package: pkg, onPress }: MyPackageCardProps) {
  const renderInfoLine = () => {
    if (pkg.status === "active") {
      return (
        <p className="text-sm text-neutral-600">
          Co-pay: UGX {pkg.package.copay.toLocaleString()} · Expires: {formatPackageDate(pkg.expiryDate)}
        </p>
      );
    }

    if (pkg.status === "completed" && pkg.completedDate) {
      return (
        <p className="text-sm text-neutral-600">
          Completed on: {formatPackageDate(pkg.completedDate)}
        </p>
      );
    }

    if (pkg.status === "expired") {
      const forfeited = getVisitsForfeited(pkg);
      return (
        <p className="text-sm text-neutral-600">
          Visits forfeited: {forfeited} · Expired: {formatPackageDate(pkg.expiryDate)}
        </p>
      );
    }

    return null;
  };

  const renderBottomContent = () => {
    if (pkg.status === "active") {
      return (
        <VisitBadges
          total={pkg.totalVisits}
          used={pkg.usedVisits}
          remaining={pkg.remainingVisits}
        />
      );
    }

    if (pkg.status === "completed") {
      return <StatusBadge status="completed" />;
    }

    if (pkg.status === "expired") {
      return <StatusBadge status="expired" />;
    }

    return null;
  };

  return (
    <button
      onClick={onPress}
      className="mt-4 w-full rounded-2xl border border-neutral-400 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
    >
      {/* Top Row */}
      <div className="flex items-start gap-3">
        {/* Icon Circle */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
          {getCategoryIcon(pkg.package.category)}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-neutral-900">
            {getCategoryDisplayName(pkg.package.category)}
          </h3>
          {renderInfoLine()}
        </div>

        {/* Chevron */}
        <ChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-600" />
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-neutral-200" />

      {/* Bottom Row */}
      {renderBottomContent()}
    </button>
  );
}
