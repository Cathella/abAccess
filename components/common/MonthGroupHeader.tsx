import { Calendar } from "lucide-react";

interface MonthGroupHeaderProps {
  month: string; // e.g., "January 2025"
}

export function MonthGroupHeader({ month }: MonthGroupHeaderProps) {
  return (
    <div className="flex items-center justify-center py-4">
      <Calendar className="h-5 w-5 text-neutral-500" />
      <span className="ml-2 text-sm font-medium text-neutral-700">
        {month}
      </span>
    </div>
  );
}
