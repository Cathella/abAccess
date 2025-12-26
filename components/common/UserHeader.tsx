import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserHeaderProps {
  greeting: string;
  memberId?: string;
  onNotificationsClick?: () => void;
  className?: string;
}

/**
 * Fixed, reusable header for authenticated pages.
 * Stays pinned to the top and spans full width.
 */
export function UserHeader({
  greeting,
  memberId,
  onNotificationsClick,
  className,
}: UserHeaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-screen bg-white",
        className
      )}
    >
      <div className="mx-auto max-w-screen pt-4 pb-2 sm:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start px-4 justify-between">
            <div>
              <p className="text-sm text-neutral-900">
                {greeting} <span role="img" aria-label="wave">👋</span>
              </p>
              {memberId && (
                <Link href="#" className="text-base font-bold text-secondary-900">
                  {memberId}
                </Link>
              )}
            </div>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-2xl"
              aria-label="Notifications"
              onClick={onNotificationsClick}
            >
              <span role="img" aria-label="bell">🔔</span>
            </button>
          </div>
          <div className="h-[1.5px] w-full bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}
