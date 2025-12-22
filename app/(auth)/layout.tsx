import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - ABA Access",
  description: "Sign in to access your healthcare packages",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      {/* Safe area container for mobile devices */}
      <div className="flex min-h-screen flex-col">
        {/* Main content - centered vertically and horizontally */}
        <main className="flex flex-1 items-center justify-center px-4 py-8 safe-area-inset">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
