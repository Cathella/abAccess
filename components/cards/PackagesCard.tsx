"use client";

import { Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePackageStore } from "@/stores/packageStore";
import { useRouter } from "next/navigation";

interface PackagesCardProps {
  className?: string;
}

/**
 * PackagesCard - Shows package status on dashboard
 *
 * Empty state: Shows prompt to browse and purchase packages
 * Active packages: Shows count and links to /my-packages
 */
export function PackagesCard({ className }: PackagesCardProps) {
  const router = useRouter();
  const userPackages = usePackageStore((state) => state.userPackages);

  // Count active packages
  const activePackages = userPackages.filter((pkg) => pkg.status === "active");
  const hasActivePackages = activePackages.length > 0;

  const handleClick = () => {
    if (hasActivePackages) {
      router.push("/my-packages");
    } else {
      router.push("/packages");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full rounded-4xl border bg-white p-4",
        "flex flex-col items-center justify-center",
        "transition-colors hover:bg-neutral-50",
        hasActivePackages ? "border-neutral-400" : "border-dashed border-neutral-400",
        className
      )}
    >
      {/* Icon Circle */}
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
        <Package className="h-6 w-6 text-neutral-900" />
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-sm font-semibold",
          hasActivePackages ? "text-neutral-900" : "text-secondary-900"
        )}>
          {hasActivePackages
            ? `${activePackages.length} active ${activePackages.length === 1 ? 'package' : 'packages'}`
            : "Add packages"
          }
        </span>
        <ChevronRight className={cn(
          "h-5 w-5",
          hasActivePackages ? "text-neutral-900" : "text-secondary-900"
        )} />
      </div>
    </button>
  );
}
