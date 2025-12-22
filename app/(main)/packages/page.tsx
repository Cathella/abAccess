import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages - ABA Access",
  description: "Browse healthcare packages",
};

export default function PackagesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Packages Page</h1>
    </div>
  );
}
