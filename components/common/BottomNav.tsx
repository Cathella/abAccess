"use client";

import { useRouter, usePathname } from "next/navigation";
import { CalendarCheck, Home, Package, Users } from "lucide-react";
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";

interface NavTab {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const tabs: NavTab[] = [
  { id: "home", label: "Home", icon: Home, path: "/dashboard" },
  { id: "family", label: "Family", icon: Users, path: "/family" },
  { id: "packages", label: "Packages", icon: Package, path: "/my-packages" },
  { id: "visits", label: "Visits", icon: CalendarCheck, path: "/visits" },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isBottomNavVisible, setActiveTab } = useUIStore();

  // Determine active tab based on pathname
  // Special handling for packages: /packages and /my-packages both highlight the packages tab
  const getActiveTabId = () => {
    if (pathname?.startsWith("/packages") || pathname?.startsWith("/my-packages")) {
      return "packages";
    }
    return tabs.find((tab) => pathname?.startsWith(tab.path))?.id || "home";
  };

  const activeTabId = getActiveTabId();

  if (!isBottomNavVisible) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 w-screen bg-transparent">
      <div className="w-screen px-0">
        <div className="flex items-start justify-between rounded-t-[32px] rounded-b-none border-2 border-neutral-900 bg-white px-4 pb-6 pt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  router.push(tab.path);
                }}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-primary-100 text-neutral-900"
                    : "text-neutral-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    isActive ? "text-neutral-900" : "text-neutral-900"
                  )}
                  strokeWidth={2.25}
                />
                {isActive && <span className="text-base font-semibold">{tab.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
