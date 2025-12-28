"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { SafeArea } from "@/components/common/SafeArea";

interface RemoveDependentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dependentName: string;
  isLoading?: boolean;
}

export function RemoveDependentModal({
  isOpen,
  onClose,
  onConfirm,
  dependentName,
  isLoading = false,
}: RemoveDependentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* Overlay with 50% opacity */}
        <DialogOverlay className="bg-black/50" />

        {/* Bottom Sheet Content */}
        <DialogContent className="fixed! bottom-0! left-0! right-0! top-auto! translate-x-0! translate-y-0! max-w-none! w-full! rounded-none! border-0! p-0! gap-0! [&>button]:hidden z-50!">
          <SafeArea inset="bottom" className="bg-white">
            <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center">
              {/* Emoji */}
              <div className="mb-6 text-[64px] leading-none" role="img" aria-label="sad">
                😔
              </div>

              {/* Title */}
              <h2 className="mb-3 text-xl font-bold text-neutral-900">
                Remove {dependentName} from your family?
              </h2>

              {/* Description */}
              <p className="mb-8 text-base text-neutral-600 leading-[160%]">
                {dependentName} will no longer appear in your account. Any upcoming visits booked for {dependentName} will be cancelled.
              </p>

              {/* Cancel Link */}
              <button
                onClick={onClose}
                disabled={isLoading}
                className="mb-3 text-base font-semibold text-neutral-900 hover:underline disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Remove Button */}
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="h-12 w-full rounded-xl border-[1.5px] border-neutral-900 bg-error-100 text-base font-semibold text-neutral-900 transition-colors hover:bg-error-100/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Removing..." : "Remove"}
              </button>
            </div>
          </SafeArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
