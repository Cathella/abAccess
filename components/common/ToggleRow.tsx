import { cn } from "@/lib/utils";

interface ToggleRowProps {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export default function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  disabled = false,
}: ToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-4 border-b border-neutral-300 last:border-b-0",
        disabled && "opacity-50"
      )}
    >
      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <span className="block text-base font-medium text-neutral-900">
          {label}
        </span>
        {description && (
          <span className="block text-sm text-neutral-600 mt-0.5">
            {description}
          </span>
        )}
      </div>

      {/* Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onToggle(!enabled)}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0",
          enabled ? "bg-secondary-900" : "bg-neutral-500",
          disabled && "cursor-not-allowed"
        )}
        disabled={disabled}
      >
        <span
          className={cn(
            "absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
