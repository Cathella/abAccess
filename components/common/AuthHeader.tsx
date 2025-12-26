"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthHeaderProps {
  backTo?: string;
  onBack?: () => void;
}

export function AuthHeader({ backTo, onBack }: AuthHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 bg-white">
        {/* Back button */}
        <div className="px-6 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-6 w-6 text-neutral-900" strokeWidth={2} />
            <span className="sr-only">Go back</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="mt-4 h-[1.5px] w-full bg-neutral-900" />
      </div>
      {/* Spacer to offset fixed header height */}
      <div className="h-16" />
    </>
  );
}
