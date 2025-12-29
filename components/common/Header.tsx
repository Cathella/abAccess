"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  className,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-neutral-900 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-12 w-12" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          {title && (
            <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
          )}
        </div>
      </div>
    </header>
  );
}
