import { Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackagesCardProps {
  onBrowsePackages?: () => void;
  className?: string;
}

/**
 * PackagesCard - Empty State (no packages)
 *
 * Shows prompt to browse and purchase packages on the dashboard.
 * This is the empty state design with dashed border.
 */
export function PackagesCard({ onBrowsePackages, className }: PackagesCardProps) {
  return (
    <button
      onClick={onBrowsePackages}
      className={cn(
        "w-full rounded-4xl border border-dashed border-neutral-400 bg-white p-4",
        "flex flex-col items-center justify-center",
        "transition-colors hover:bg-neutral-50",
        className
      )}
    >
      {/* Icon Circle */}
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
        <Package className="h-6 w-6 text-neutral-900" />
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-secondary-900">
          Add packages
        </span>
        <ChevronRight className="h-5 w-5 text-secondary-900" />
      </div>
    </button>
  );
}
