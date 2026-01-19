import { Info, AlertTriangle, CheckCircle } from "lucide-react";

interface BookingInfoCardProps {
  title: string;
  message: string;
  icon?: 'info' | 'warning' | 'success';
}

export function BookingInfoCard({
  title,
  message,
  icon = 'info',
}: BookingInfoCardProps) {
  // Select icon and color based on variant
  const iconConfig = {
    info: {
      Icon: Info,
      color: 'text-neutral-900',
    },
    warning: {
      Icon: AlertTriangle,
      color: 'text-yellow-500',
    },
    success: {
      Icon: CheckCircle,
      color: 'text-green-500',
    },
  };

  const { Icon, color } = iconConfig[icon];

  return (
    <div className="rounded-2xl bg-secondary-100 p-4">
      {/* Icon + Title Row */}
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className="font-semibold text-base text-neutral-900">
          {title}
        </h3>
      </div>

      {/* Divider */}
      <div className="border-b border-secondary-900/20 my-2" />

      {/* Message */}
      <p className="text-sm text-neutral-900">
        {message}
      </p>
    </div>
  );
}
