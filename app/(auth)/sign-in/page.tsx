import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - ABA Access",
  description: "Sign in to access your healthcare packages",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Sign In Page</h1>
    </div>
  );
}
