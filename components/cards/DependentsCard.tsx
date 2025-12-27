import { Heart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DependentsCardProps {
  onAddDependent?: () => void;
  className?: string;
}

/**
 * DependentsCard - Empty State (no dependents)
 *
 * Shows prompt to add dependents/family members on the dashboard.
 * This is the empty state design with dashed border.
 */
export function DependentsCard({ onAddDependent, className }: DependentsCardProps) {
  return (
    <button
      onClick={onAddDependent}
      className={cn(
        "w-full rounded-[24px] border-2 border-dashed border-neutral-400 bg-white p-4",
        "flex flex-col items-center justify-center",
        "transition-colors hover:bg-neutral-50",
        className
      )}
    >
      {/* Icon Circle */}
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <Heart className="h-8 w-8 fill-[#FF5E74] text-[#DC4349]" />
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-900">
          Add dependent
        </span>
        <ChevronRight className="h-5 w-5 text-neutral-900" />
      </div>
    </button>
  );
}
