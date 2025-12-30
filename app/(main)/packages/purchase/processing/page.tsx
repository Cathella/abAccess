"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProcessingPaymentPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate payment processing with 2-3 second delay
    const delay = Math.random() * 1000 + 2000; // Random delay between 2000-3000ms

    const timer = setTimeout(() => {
      // 80% chance of success, 20% chance of failure
      const random = Math.random();

      if (random < 0.8) {
        // Success
        router.push("/packages/purchase/success");
      } else {
        // Failed
        router.push("/packages/purchase/failed");
      }
    }, delay);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {/* Spinner */}
      <Loader2
        className="h-16 w-16 animate-spin mb-6"
        style={{ color: "#3A8DFF" }}
      />

      {/* Processing text */}
      <h1 className="font-bold text-xl text-neutral-900 mb-2">
        Processing payment...
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-center">
        Please don't close the app.
      </p>
    </div>
  );
}
