interface VisitBadgesProps {
  total: number;
  used: number;
  remaining: number;
}

export function VisitBadges({ total, used, remaining }: VisitBadgesProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="rounded-lg bg-secondary-100 px-3 py-1.5">
        <span className="text-xs font-medium text-secondary-900">
          Visits: {total}
        </span>
      </div>
      <div className="rounded-lg bg-neutral-200 px-3 py-1.5">
        <span className="text-xs font-medium text-neutral-900">
          Used: {used}
        </span>
      </div>
      <div className="rounded-lg bg-warning-100 px-3 py-1.5">
        <span className="text-xs font-medium text-warning-900">
          Remaining: {remaining}
        </span>
      </div>
    </div>
  );
}
