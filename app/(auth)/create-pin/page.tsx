import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create PIN - ABA Access",
  description: "Set a PIN to secure your account",
};

export default function CreatePinPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Create PIN Page</h1>
    </div>
  );
}
