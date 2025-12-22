import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - ABA Access",
  description: "Overview of your healthcare packages",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>
    </div>
  );
}
