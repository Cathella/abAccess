import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-100 flex-col items-center justify-center px-4 py-12 text-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 max-w-md">
        {/* Icon */}
        <div className="rounded-full bg-neutral-200 p-6">
          <Icon className="h-12 w-12 text-neutral-600" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
          {description && (
            <p className="text-sm text-neutral-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Button */}
        {action && (
          <Button
            onClick={action.onClick}
            className="mt-2 min-h-11 px-6"
            size="lg"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
