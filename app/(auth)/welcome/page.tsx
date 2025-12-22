import type { Metadata } from "next";
import Link from "next/link";
import { SafeArea } from "@/components/common/SafeArea";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Welcome - ABA Access",
  description: "Affordable healthcare for your family",
};

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Main content - centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Brand mark */}
        <div className="mb-6 flex flex-col items-center">
          <svg
            className="mb-4 h-16 w-16"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-rose-900)" />
                <stop offset="100%" stopColor="var(--color-brand-rose-700)" />
              </linearGradient>
              <linearGradient id="heartHighlight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-rose-700)" />
                <stop offset="100%" stopColor="var(--color-brand-rose-900)" />
              </linearGradient>
            </defs>
            <path
              d="M60 100s-29-18-45-35C5 55 1 44 1 31 1 19 11 9 24 9c10 0 19 6 24 14 5-8 14-14 24-14 13 0 23 10 23 22 0 13-5 24-16 34-16 16-45 35-45 35z"
              fill="url(#heartGradient)"
            />
            <path
              d="M78 54s-12-7-19-14c-6-6-8-10-8-16 0-7 6-12 13-12 5 0 10 3 13 8 3-5 8-8 13-8 7 0 13 5 13 12 0 6-2 10-8 16-7 7-17 14-17 14z"
              fill="url(#heartHighlight)"
            />
            <path
              d="M90 30c7 7 8 16 4 23"
              fill="none"
              stroke="var(--color-brand-rose-700)"
              strokeLinecap="round"
              strokeWidth="6"
            />
          </svg>
          <div className="relative">
            <span className="text-[34px] font-semibold tracking-tight text-secondary-900">
              ab<span className="font-bold">Access</span>
            </span>
            <svg
              className="absolute -top-4 right-4 h-5 w-6 text-secondary-900/60"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M6 7l6-6 6 6M6 15l6-6 6 6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Tagline */}
        <h1 className="mb-3 text-h2 font-semibold text-neutral-900">
          Affordable healthcare for your family
        </h1>

        {/* Description */}
        <p className="max-w-sm text-body text-neutral-600">
          Save on visits to 45+ partner facilities with prepaid healthcare packages.
        </p>
      </div>

      {/* Action buttons - fixed at bottom */}
      <SafeArea inset="bottom" className="space-y-4 px-6 pb-8">
        {/* Create Account Button */}
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-14 w-full rounded-2xl border-2 border-neutral-900 bg-primary-100 text-base font-semibold text-neutral-900 hover:bg-primary-100/80"
        >
          <Link href={ROUTES.ONBOARDING}>Create Account</Link>
        </Button>

        {/* Login Button */}
        <Button
          asChild
          size="lg"
          className="h-14 w-full rounded-2xl border-2 border-neutral-900 bg-primary-800 text-base font-semibold text-neutral-900 hover:bg-primary-700"
        >
          <Link href={ROUTES.SIGN_IN}>Login</Link>
        </Button>
      </SafeArea>
    </div>
  );
}
