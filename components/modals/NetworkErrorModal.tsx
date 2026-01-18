"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NetworkErrorModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onRetry: () => void;
}

export function NetworkErrorModal({
  isOpen,
  onCancel,
  onRetry,
}: NetworkErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogPortal>
        {/* Overlay with 50% opacity */}
        <DialogOverlay className="bg-black/50" />

        {/* Modal Content */}
        <DialogContent className="max-w-100 rounded-2xl border-0 p-0 gap-0 [&>button]:hidden">
          <div className="flex flex-col items-center px-6 py-8 text-center">
            {/* Emoji */}
            <div className="mb-6 text-[64px] leading-none" role="img" aria-label="thinking">
              🤔
            </div>

            {/* Title */}
            <DialogTitle className="mb-3 text-xl font-bold text-neutral-900">
              Connection error
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="mb-8 text-base text-neutral-600 leading-[160%]">
              We couldn&apos;t reach our servers. Please check your internet connection and try again.
            </DialogDescription>

            {/* Cancel Button - Text Button */}
            <button
              onClick={onCancel}
              className="mb-3 text-base font-semibold text-neutral-900 hover:underline"
            >
              Cancel
            </button>

            {/* Try Again Button - Mint Background */}
            <button
              onClick={onRetry}
              className="h-12 w-full rounded-xl text-base font-semibold transition-colors"
              style={{
                backgroundColor: "#E8F4F1",
                color: "#1A1A1A",
              }}
            >
              Try again
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
