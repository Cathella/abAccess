import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main content - centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        {/* Tagline */}
        <h1 className="mb-3 text-center text-2xl font-semibold text-neutral-900">
          Affordable healthcare for your family
        </h1>

        {/* Description */}
        <p className="max-w-sm text-center text-neutral-600 leading-relaxed">
          Save on visits to 45+ partner facilities with prepaid healthcare packages.
        </p>
      </div>

      {/* Action buttons - fixed at bottom */}
      <div className="space-y-3 px-6 pb-8 pt-4 safe-area-inset-bottom">
        {/* Sign In Button */}
        <Button
          asChild
          size="lg"
          className="w-full min-h-[48px] text-base font-semibold"
        >
          <Link href={ROUTES.SIGN_IN}>Sign In</Link>
        </Button>

        {/* Create Account Button */}
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full min-h-[48px] text-base font-semibold border-2"
        >
          <Link href={ROUTES.ONBOARDING}>Create Account</Link>
        </Button>
      </div>
    </div>
  );
}
