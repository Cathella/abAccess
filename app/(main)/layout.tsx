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
    hideHeader: true,
    hideBottomNav: true,
  },
  [ROUTES.MY_PACKAGES]: {
    title: "My Packages",
    showBack: false,
    showNotifications: false,
    hideHeader: true,
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
  "/dev-tools": {
    title: "Dev Tools",
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

    const unsubscribe = useAuthStore.persist?.onFinishHydration?.(() => setHasHydrated(true));
    return () => {
      unsubscribe?.();
    };
  }, []);

  // Check authentication (skip for dev-tools)
  useEffect(() => {
    if (hasHydrated && !user && pathname !== '/dev-tools') {
      router.push(ROUTES.WELCOME);
    }
  }, [user, router, hasHydrated, pathname]);

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
    } else if (pathname?.startsWith('/my-packages/') && pathname?.includes('/history')) {
      // Package history page
      currentConfig = {
        title: "Usage history",
        showBack: true,
        showNotifications: false,
        hideBottomNav: true,
      };
    } else if (pathname?.startsWith('/my-packages/') && pathname?.match(/^\/my-packages\/[^/]+$/)) {
      // Package detail page - need to get dynamic title, for now use generic
      currentConfig = {
        title: "Package Details",
        showBack: true,
        showNotifications: false,
        hideBottomNav: true,
      };
    } else if (pathname?.startsWith('/wallet/top-up')) {
      // Hide header and bottom nav for all wallet top-up flow pages
      currentConfig = {
        title: "",
        showBack: false,
        showNotifications: false,
        hideHeader: true,
        hideBottomNav: true,
      };
    } else if (pathname?.startsWith('/wallet/history/') && pathname?.match(/^\/wallet\/history\/[^/]+$/)) {
      currentConfig = {
        title: "Transaction Details",
        showBack: true,
        showNotifications: false,
        hideHeader: true,
        hideBottomNav: true,
      };
    } else if (pathname === '/wallet/history') {
      currentConfig = {
        title: "Transaction History",
        showBack: true,
        showNotifications: false,
        hideHeader: true,
        hideBottomNav: true,
      };
    } else if (pathname?.startsWith('/packages/purchase')) {
      // Hide header and bottom nav for all package purchase flow pages
      currentConfig = {
        title: "",
        showBack: false,
        showNotifications: false,
        hideHeader: true,
        hideBottomNav: true,
      };
    } else if (pathname?.startsWith('/packages/') && pathname?.match(/^\/packages\/[^/]+\/[^/]+$/)) {
      // Package detail page (e.g., /packages/consultations/cons-5)
      currentConfig = {
        title: "Package Details",
        showBack: true,
        showNotifications: false,
        hideHeader: true,
        hideBottomNav: true,
      };
    } else if (pathname?.startsWith('/packages/') && pathname?.match(/^\/packages\/[^/]+$/)) {
      // Category page (e.g., /packages/consultations)
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

  // Don't render if not authenticated (except for dev-tools)
  if (!hasHydrated) {
    return null;
  }

  if (!user && pathname !== '/dev-tools') {
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
