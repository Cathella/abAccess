import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - ABA Access",
  description: "Set up your ABA Access account",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Onboarding Page</h1>
    </div>
  );
}
