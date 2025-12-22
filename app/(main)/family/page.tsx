import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Members - ABA Access",
  description: "Manage family members on your account",
};

export default function FamilyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Family Page</h1>
    </div>
  );
}
