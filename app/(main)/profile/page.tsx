import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - ABA Access",
  description: "Manage your profile details",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Profile Page</h1>
    </div>
  );
}
