import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Code - ABA Access",
  description: "Verify your one-time passcode",
};

export default function VerifyOTPPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Verify OTP Page</h1>
    </div>
  );
}
