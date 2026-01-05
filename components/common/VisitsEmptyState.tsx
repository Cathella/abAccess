"use client";

import Link from "next/link";

export function VisitsEmptyState() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-8">
      <div className="flex flex-col items-center text-center">
        {/* Calendar Emoji */}
        <div className="text-4xl">📅</div>

        {/* Title */}
        <h2 className="mt-6 text-xl font-bold text-neutral-900">
          Ready for your first visit?
        </h2>

        {/* Subtitle */}
        <p className="mt-2 max-w-xs text-base text-neutral-700">
          Purchase a package, then visit any of our 45+ partner facilities.
        </p>

        {/* Primary Button */}
        <Link
          href="#"
          className="flex justify-center items-center mt-8 rounded-xl bg-primary-100 border-[1.5px] border-neutral-900 px-6 h-10 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
        >
          Find a facility
        </Link>
      </div>
    </div>
  );
}
