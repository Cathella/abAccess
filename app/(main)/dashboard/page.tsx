"use client";

import { useAuth } from "@/hooks/useAuth";
import { getUserFullName } from "@/lib/mappers/userMapper";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-h2 font-bold text-neutral-900">
          Welcome, {user.firstName}!
        </h1>
        <p className="mt-2 text-body text-neutral-600">
          {getUserFullName(user)} • {user.phone}
        </p>
      </div>

      {/* Placeholder Cards */}
      <div className="space-y-4">
        <div className="rounded-lg border border-neutral-400 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            My Packages
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            View your active healthcare packages
          </p>
        </div>

        <div className="rounded-lg border border-neutral-400 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Visits
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Track your facility visits
          </p>
        </div>

        <div className="rounded-lg border border-neutral-400 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Wallet</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Manage your account balance
          </p>
        </div>
      </div>

      {/* Temporary logout button for testing */}
      <div className="mt-8">
        <button
          onClick={logout}
          disabled={isLoading}
          className="w-full rounded-xl bg-error-900 px-6 py-3 text-white hover:bg-error-900/90 disabled:bg-neutral-400"
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
