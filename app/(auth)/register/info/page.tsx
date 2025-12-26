import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Information - ABA Access",
  description: "Enter your personal information",
};

export default function RegisterInfoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Register Info Page (Step 2)</h1>
      <p className="text-neutral-600 mt-2">Coming soon...</p>
    </div>
  );
}
