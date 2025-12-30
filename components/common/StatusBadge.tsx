import { Check, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "active" | "completed" | "expired" | "expiring_soon" | "low_visits";
  text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const config = {
    completed: {
      icon: Check,
      bgColor: "bg-neutral-200",
      textColor: "text-neutral-900",
      defaultText: "Completed",
    },
    expired: {
      icon: XCircle,
      bgColor: "bg-neutral-200",
      textColor: "text-neutral-900",
      defaultText: "Expired",
    },
    expiring_soon: {
      icon: AlertCircle,
      bgColor: "bg-error-100",
      textColor: "text-error-900",
      defaultText: "Expiring soon",
    },
    low_visits: {
      icon: AlertCircle,
      bgColor: "bg-warning-100",
      textColor: "text-neutral-900",
      defaultText: "Only 1 visit left",
    },
    active: {
      icon: null,
      bgColor: "bg-secondary-100",
      textColor: "text-secondary-900",
      defaultText: "Active",
    },
  };

  const { icon: Icon, bgColor, textColor, defaultText } = config[status];

  return (
    <div className={`flex items-center gap-2 rounded-[20px] ${bgColor} px-4 py-2`}>
      {Icon && <Icon className={`h-4 w-4 ${textColor}`} />}
      <span className={`text-sm font-medium ${textColor}`}>
        {text || defaultText}
      </span>
    </div>
  );
}
