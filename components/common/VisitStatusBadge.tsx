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
      bgColor: "bg-[#E8F4E8]",
      textColor: "text-[#2D5A2D]",
    },
    warning: {
      bgColor: "bg-transparent",
      textColor: "text-[#D97706]",
    },
    error: {
      bgColor: "bg-[#FEE2E2]",
      textColor: "text-[#991B1B]",
    },
    info: {
      bgColor: "bg-[#E8F4E8]",
      textColor: "text-[#2D5A2D]",
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
