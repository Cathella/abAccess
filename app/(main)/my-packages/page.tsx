import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Packages - ABA Access",
  description: "Manage your active packages",
};

export default function MyPackagesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">My Packages Page</h1>
    </div>
  );
}
