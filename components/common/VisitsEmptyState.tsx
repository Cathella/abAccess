"use client";

import Link from "next/link";

export function VisitsEmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center px-8">
      <div className="flex flex-col items-center text-center">
        {/* Calendar Emoji */}
        <div className="text-6xl">📅</div>

        {/* Title */}
        <h2 className="mt-6 text-xl font-bold text-gray-900">
          Ready for your first visit?
        </h2>

        {/* Subtitle */}
        <p className="mt-2 max-w-xs text-base text-gray-500">
          Purchase a package, then visit any of our 45+ partner facilities.
        </p>

        {/* Primary Button */}
        <Link
          href="/packages"
          className="mt-8 rounded-xl border border-gray-900 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          Browse packages
        </Link>

        {/* Secondary Link */}
        <Link
          href="#"
          className="mt-4 text-sm font-medium text-[#3A8DFF] hover:underline"
        >
          Find a facility
        </Link>
      </div>
    </div>
  );
}
