"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { BottomNav } from "@/components/common/BottomNav";
import { SafeArea } from "@/components/common/SafeArea";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/lib/constants";

// Route configurations for Header
const routeConfig: Record<string, { title?: string; showBack?: boolean; showNotifications?: boolean; hideHeader?: boolean }> = {
  [ROUTES.DASHBOARD]: {
    title: "Dashboard",
    showBack: false,
    showNotifications: false,
    hideHeader: true,
  },
  [ROUTES.PACKAGES]: {
    title: "Packages",
    showBack: false,
    showNotifications: true,
  },
  [ROUTES.MY_PACKAGES]: {
    title: "My Packages",
    showBack: true,
    showNotifications: true,
  },
  [ROUTES.VISITS]: {
    title: "Visits",
    showBack: false,
    showNotifications: true,
  },
  [ROUTES.WALLET]: {
    title: "Wallet",
    showBack: false,
    showNotifications: true,
  },
  [ROUTES.PROFILE]: {
    title: "Profile",
    showBack: false,
    showNotifications: true,
  },
  [ROUTES.FAMILY]: {
    title: "Family Members",
    showBack: true,
    showNotifications: true,
  },
  [ROUTES.NOTIFICATIONS]: {
    title: "Notifications",
    showBack: true,
    showNotifications: false,
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasHydrated, setHasHydrated] = useState(
    useAuthStore.persist?.hasHydrated?.() ?? false
  );
  const { user } = useAuthStore();

  // Wait for persisted auth store to hydrate before enforcing redirects
  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated?.()) {
      setHasHydrated(true);
      return;
    }

    const unsubscribe = useAuthStore.persist?.onFinish?.(() => setHasHydrated(true));
    return () => {
      unsubscribe?.();
    };
  }, []);

  // Check authentication
  useEffect(() => {
    if (hasHydrated && !user) {
      router.push(ROUTES.WELCOME);
    }
  }, [user, router, hasHydrated]);

  // Get current route config
  const currentConfig = routeConfig[pathname || ROUTES.DASHBOARD] || {
    title: "ABA Access",
    showBack: true,
    showNotifications: true,
  };

  // Don't render if not authenticated
  if (!hasHydrated) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header (hidden on dashboard to match design) */}
      {!currentConfig.hideHeader && (
        <Header
          title={currentConfig.title}
          showBack={currentConfig.showBack}
          showNotifications={currentConfig.showNotifications}
        />
      )}

      {/* Main content area */}
      {/* pb-20 accounts for bottom nav height (~80px) */}
      {/* safe-area-inset-x for notched phones */}
      <main className="flex-1 overflow-y-auto pb-20">
        <SafeArea inset="x">
          {children}
        </SafeArea>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
