"use client";

import { useEffect, useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper
 *
 * This component handles:
 * - Zustand persist hydration
 * - Future provider integrations (react-query, etc.)
 */
export function Providers({ children }: ProvidersProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand stores to hydrate from localStorage
    // This prevents hydration mismatches between server and client
    setIsHydrated(true);
  }, []);

  // Show nothing during hydration to prevent flash of incorrect content
  // The root layout will show a loading state if needed
  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {/* Future providers can be added here */}
      {/* Example: <QueryClientProvider client={queryClient}> */}
      {children}
      {/* </QueryClientProvider> */}
    </>
  );
}
