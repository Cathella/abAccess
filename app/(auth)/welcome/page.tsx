"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SafeArea } from "@/components/common/SafeArea";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { ROUTES } from "@/lib/constants";

export default function WelcomePage() {
  const [redirectParam, setRedirectParam] = useState('');

  useEffect(() => {
    // Get redirect from URL on client side
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      console.log('[Welcome] Current URL:', window.location.href);
      console.log('[Welcome] Search params:', window.location.search);
      console.log('[Welcome] Redirect parameter:', redirect);
      if (redirect) {
        setRedirectParam(`?redirect=${encodeURIComponent(redirect)}`);
        console.log('[Welcome] Setting redirect param:', `?redirect=${encodeURIComponent(redirect)}`);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white" suppressHydrationWarning>
      {/* Main content - centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/logos/logo-text.svg"
            alt="abAccess"
            width={200}
            height={80}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <h1 className="mb-3 text-xl font-semibold text-neutral-900 leading-8">
          Affordable healthcare for your family
        </h1>

        {/* Description */}
        <p className="text-base text-neutral-700 mb-6">
          Save on visits to 45+ partner facilities with prepaid healthcare packages.
        </p>
      </div>

      {/* Action buttons - fixed at bottom */}
      <SafeArea inset="bottom" className="space-y-2 mb-6">
        {/* Create Account Button */}
        <SecondaryButton
          href={`${ROUTES.REGISTER}${redirectParam}`}
          onClick={() => console.log('[Welcome] Register button clicked, href:', `${ROUTES.REGISTER}${redirectParam}`)}
        >
          Create Account
        </SecondaryButton>

        {/* Login Button */}
        <PrimaryButton
          href={`${ROUTES.SIGN_IN}${redirectParam}`}
          onClick={() => console.log('[Welcome] Login button clicked, href:', `${ROUTES.SIGN_IN}${redirectParam}`)}
        >
          Login
        </PrimaryButton>
      </SafeArea>
    </div>
  );
}
