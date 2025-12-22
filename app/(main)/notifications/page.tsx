import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications - ABA Access",
  description: "View your latest notifications",
};

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Notifications Page</h1>
    </div>
  );
}
