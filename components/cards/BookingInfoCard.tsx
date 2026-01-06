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
      color: 'text-blue-500',
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
    <div className="rounded-2xl bg-[#E3F1FC] p-4">
      {/* Icon + Title Row */}
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className="font-semibold text-neutral-900">
          {title}
        </h3>
      </div>

      {/* Divider */}
      <div className="border-b border-blue-200/50 my-2" />

      {/* Message */}
      <p className="text-sm text-gray-600">
        {message}
      </p>
    </div>
  );
}
