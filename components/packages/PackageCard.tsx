"use client";

import { useRouter } from "next/navigation";
import { UserPackageType } from "@/types";
import { formatPackageDate, getCategoryDisplayName, getVisitsForfeited } from "@/lib/packages";
import { Stethoscope, FlaskConical, Pill, UserRound, Eye, Baby, ChevronRight, Check, AlertTriangle } from "lucide-react";

interface PackageCardProps {
  package: UserPackageType;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "consultations":
      return <Stethoscope className="h-6 w-6 text-neutral-900" />;
    case "lab_tests":
      return <FlaskConical className="h-6 w-6 text-neutral-900" />;
    case "pharmacy":
      return <Pill className="h-6 w-6 text-neutral-900" />;
    case "dental":
      return <UserRound className="h-6 w-6 text-neutral-900" />;
    case "optical":
      return <Eye className="h-6 w-6 text-neutral-900" />;
    case "maternity":
      return <Baby className="h-6 w-6 text-neutral-900" />;
    default:
      return <Stethoscope className="h-6 w-6 text-neutral-900" />;
  }
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const router = useRouter();

  const renderBottomContent = () => {
    if (pkg.status === "active") {
      return (
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-secondary-100 px-3 py-1">
            <span className="text-sm font-medium text-neutral-900">
              Visits: {pkg.totalVisits}
            </span>
          </div>
          <div className="rounded-full bg-neutral-200 px-3 py-1">
            <span className="text-sm font-medium text-neutral-900">
              Used: {pkg.usedVisits}
            </span>
          </div>
          <div className="rounded-full bg-warning-100 px-3 py-1">
            <span className="text-sm font-medium text-neutral-900">
              Remaining: {pkg.remainingVisits}
            </span>
          </div>
        </div>
      );
    }

    if (pkg.status === "completed") {
      return (
        <div className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 w-fit">
          <Check className="h-5 w-5 text-neutral-900" />
          <span className="text-sm font-medium text-neutral-900">Completed</span>
        </div>
      );
    }

    if (pkg.status === "expired") {
      return (
        <div className="flex items-center gap-2 rounded-full bg-error-100 px-3 py-1 w-fit">
          <AlertTriangle className="h-5 w-5 text-neutral-900" />
          <span className="text-sm font-medium text-neutral-900">Expired</span>
        </div>
      );
    }
  };

  const renderInfoLine = () => {
    if (pkg.status === "active") {
      return (
        <p className="text-sm text-neutral-700 mt-1">
          Co-pay: {pkg.package.copay.toLocaleString()} · Expires: {formatPackageDate(pkg.expiryDate)}
        </p>
      );
    }

    if (pkg.status === "completed" && pkg.completedDate) {
      return (
        <p className="text-sm text-neutral-700 mt-1">
          Completed on: {formatPackageDate(pkg.completedDate)}
        </p>
      );
    }

    if (pkg.status === "expired") {
      const forfeited = getVisitsForfeited(pkg);
      return (
        <p className="text-sm text-neutral-700 mt-1">
          Visits forfeited: {forfeited} · Expired: {formatPackageDate(pkg.expiryDate)}
        </p>
      );
    }

    return null;
  };

  return (
    <button
      onClick={() => router.push(`/my-packages/${pkg.id}`)}
      className="mt-4 w-full rounded-2xl border border-neutral-400 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
    >
      {/* Top Row */}
      <div className="flex items-start gap-3">
        {/* Icon Circle */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100">
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
        <ChevronRight className="h-5 w-5 shrink-0 text-neutral-700" />
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-neutral-400" />

      {/* Bottom Row */}
      {renderBottomContent()}
    </button>
  );
}
