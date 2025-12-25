"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUIStore, useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  showNotifications = false,
  className,
}: HeaderProps) {
  const router = useRouter();
  const unreadCount = useUIStore((state) => state.unreadCount);
  const user = useAuthStore((state) => state.user);

  const initials = useMemo(() => {
    if (!user) return null;
    const parts = `${user.firstName} ${user.lastName}`.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return `${first}${second}`.toUpperCase();
  }, [user]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          {title && (
            <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/notifications")}
              className="relative h-10 w-10 rounded-full bg-secondary-100"
            >
              <Bell className="h-5 w-5 text-secondary-900" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-xs"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">
                Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
              </span>
            </Button>
          )}

          {initials && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-neutral-900">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
