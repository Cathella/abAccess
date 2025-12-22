import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visits - ABA Access",
  description: "Track upcoming and past visits",
};

export default function VisitsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Visits Page</h1>
    </div>
  );
}
