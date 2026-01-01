import { Calendar } from "lucide-react";

interface MonthGroupHeaderProps {
  month: string; // e.g., "January 2025"
}

export function MonthGroupHeader({ month }: MonthGroupHeaderProps) {
  return (
    <div className="flex items-center justify-center py-4">
      <Calendar className="h-5 w-5 text-gray-400" />
      <span className="ml-2 text-sm font-medium text-gray-500">
        {month}
      </span>
    </div>
  );
}
