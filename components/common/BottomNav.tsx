"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Package, CalendarCheck, Wallet, User } from "lucide-react";
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";

interface NavTab {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const tabs: NavTab[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/dashboard",
  },
  {
    id: "packages",
    label: "Packages",
    icon: Package,
    path: "/packages",
  },
  {
    id: "visits",
    label: "Visits",
    icon: CalendarCheck,
    path: "/visits",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: Wallet,
    path: "/wallet",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/profile",
  },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isBottomNavVisible, setActiveTab } = useUIStore();

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab.id);
    router.push(tab.path);
  };

  // Determine active tab based on current pathname
  const activeTabId =
    tabs.find((tab) => pathname?.startsWith(tab.path))?.id || "home";

  if (!isBottomNavVisible) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "rounded-md"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary-900" : "text-neutral-600"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isActive ? "text-primary-900" : "text-neutral-600"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
