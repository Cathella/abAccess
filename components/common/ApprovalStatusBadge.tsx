import { Check, AlertTriangle, Clock, X } from 'lucide-react';
import { ApprovalStatus } from '@/types';
import { APPROVAL_STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
}

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  const config = APPROVAL_STATUS_CONFIG[status];

  const IconComponent = {
    Check,
    X,
    AlertTriangle,
    Clock,
  }[config.icon] || Check;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
      config.bgColor,
      config.textColor
    )}>
      <IconComponent className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
