"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LimitReachedModal({ isOpen, onClose }: LimitReachedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* Overlay with 50% opacity */}
        <DialogOverlay className="bg-black/50" />

        {/* Modal Content */}
        <DialogContent className="max-w-[400px] rounded-2xl border-0 p-0 gap-0 [&>button]:hidden">
          <div className="flex flex-col items-center px-6 py-8 text-center">
            {/* Emoji */}
            <div className="mb-6 text-[64px] leading-none" role="img" aria-label="rolling eyes">
              🙄
            </div>

            {/* Title */}
            <h2 className="mb-3 text-xl font-bold text-neutral-900">
              You've reached the limit
            </h2>

            {/* Description */}
            <p className="mb-8 text-base text-neutral-600 leading-[160%]">
              You can add up to 3 children to your account. To add another child, you'll need to remove one first.
            </p>

            {/* Got it Button */}
            <button
              onClick={onClose}
              className="h-14 w-full rounded-2xl border border-neutral-900 bg-secondary-100 text-base font-semibold text-neutral-900 transition-colors hover:bg-secondary-100/80"
            >
              Got it
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
