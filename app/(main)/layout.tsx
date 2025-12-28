"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { BottomNav } from "@/components/common/BottomNav";
import { SafeArea } from "@/components/common/SafeArea";
import { useAuthStore } from "@/stores";
import { useFamilyStore } from "@/stores/familyStore";
import { getDependents } from "@/lib/services/dependentService";
import { ROUTES } from "@/lib/constants";

// Route configurations for Header
const routeConfig: Record<string, { title?: string; showBack?: boolean; showNotifications?: boolean; hideHeader?: boolean; hideBottomNav?: boolean }> = {
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
    hideHeader: true,
  },
  [ROUTES.FAMILY_ADD]: {
    title: "Add dependent",
    showBack: true,
    showNotifications: false,
    hideBottomNav: true,
  },
  [ROUTES.FAMILY_ADD_SUCCESS]: {
    title: "",
    showBack: false,
    showNotifications: false,
    hideHeader: true,
    hideBottomNav: true,
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
  const setDependents = useFamilyStore((state) => state.setDependents);

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

  // Fetch and sync dependents when user is authenticated
  useEffect(() => {
    if (hasHydrated && user?.id) {
      const fetchDependents = async () => {
        const result = await getDependents(user.id);
        if (result.success && result.dependents) {
          setDependents(result.dependents);
        }
      };

      fetchDependents();
    }
  }, [hasHydrated, user?.id, setDependents]);

  // Get current route config
  // Check for dynamic routes (e.g., /family/[id]/edit)
  let currentConfig = routeConfig[pathname || ROUTES.DASHBOARD];

  if (!currentConfig) {
    // Handle dynamic routes
    if (pathname?.includes('/family/') && pathname?.includes('/edit')) {
      currentConfig = {
        title: "Edit Details",
        showBack: true,
        showNotifications: false,
        hideHeader: true,
        hideBottomNav: true,
      };
    } else if (pathname?.startsWith('/family/') && pathname?.match(/^\/family\/[^/]+$/)) {
      currentConfig = {
        title: "",
        showBack: true,
        showNotifications: false,
        hideHeader: true,
        hideBottomNav: true,
      };
    } else {
      currentConfig = {
        title: "ABA Access",
        showBack: true,
        showNotifications: true,
      };
    }
  }

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
      <main className={`flex-1 overflow-y-auto ${currentConfig.hideBottomNav ? '' : 'pb-20'}`}>
        <SafeArea inset="x">
          {children}
        </SafeArea>
      </main>

      {/* Bottom Navigation */}
      {!currentConfig.hideBottomNav && <BottomNav />}
    </div>
  );
}
