"use client";

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
  // Note: We used to block rendering during hydration, but this caused issues
  // with navigation. Zustand handles hydration internally, so we can just
  // render children immediately. Individual components can handle their own
  // hydration states if needed.

  return (
    <>
      {/* Future providers can be added here */}
      {/* Example: <QueryClientProvider client={queryClient}> */}
      {children}
      {/* </QueryClientProvider> */}
    </>
  );
}
