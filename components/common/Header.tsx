"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/stores";
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
        {showNotifications && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/notifications")}
            className="relative h-9 w-9"
          >
            <Bell className="h-5 w-5" />
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
      </div>
    </header>
  );
}
