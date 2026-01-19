"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";

export default function SubmittingBookingPage() {
  const router = useRouter();
  const { session, submitBooking, canSubmit } = useBookingStore();

  useEffect(() => {
    // Redirect if prerequisites not met
    if (!canSubmit()) {
      router.replace("/book/select-package");
      return;
    }

    // Submit booking
    const handleSubmit = async () => {
      try {
        await submitBooking();

        // Navigate to success page after submission
        router.push("/book/success");
      } catch (error) {
        // On error, navigate back to confirm page
        console.error("Booking submission failed:", error);
        router.push("/book/confirm");
        // TODO: Show error toast/message
      }
    };

    handleSubmit();
  }, [canSubmit, submitBooking, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {/* Spinner */}
      <Loader2
        className="h-16 w-16 animate-spin mb-6"
        style={{ color: "#3A8DFF" }}
      />

      {/* Loading text */}
      <h1 className="font-bold text-xl text-neutral-900 mb-2">
        Submitting booking...
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-center">
        Please don&apos;t close the app.
      </p>
    </div>
  );
}
