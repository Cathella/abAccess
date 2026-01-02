import { Check, Hourglass, AlertTriangle } from "lucide-react";
import { VisitStatusType } from "@/types";
import { VISIT_STATUS_CONFIG } from "@/lib/constants";

interface VisitStatusBadgeProps {
  status: VisitStatusType;
  showIcon?: boolean;
}

export function VisitStatusBadge({ status, showIcon = true }: VisitStatusBadgeProps) {
  const config = VISIT_STATUS_CONFIG[status];

  // Map icon types to Lucide components
  const iconMap = {
    check: Check,
    clock: Hourglass,
    alert: AlertTriangle,
    x: AlertTriangle,
  };

  const Icon = iconMap[config.icon];

  // Define color styles based on design specs
  const colorStyles = {
    success: {
      bgColor: "bg-primary-100",
      textColor: "text-neutral-900",
    },
    warning: {
      bgColor: "bg-warning-100",
      textColor: "text-neutral-900",
    },
    error: {
      bgColor: "bg-error-100",
      textColor: "text-error-900",
    },
    info: {
      bgColor: "bg-secondary-100",
      textColor: "text-neutral-900",
    },
  };

  const { bgColor, textColor } = colorStyles[config.variant];

  return (
    <div className={`inline-flex items-center rounded-full ${bgColor} px-2 py-1`}>
      {showIcon && Icon && (
        <Icon className={`h-3.5 w-3.5 mr-1 ${textColor}`} />
      )}
      <span className={`text-xs font-medium ${textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
