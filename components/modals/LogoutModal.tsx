"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SafeArea } from "@/components/common/SafeArea";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />

        <DialogContent className="fixed! bottom-0! left-0! right-0! top-auto! translate-x-0! translate-y-0! max-w-none! w-full! rounded-none! border-0! p-0! gap-0! [&>button]:hidden z-50!">
          <SafeArea inset="bottom" className="bg-white">
            <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center">
              {/* Emoji */}
              <div className="mb-6 text-[64px] leading-none" role="img" aria-label="wave">
                👋
              </div>

              {/* Title */}
              <DialogTitle className="mb-3 text-xl font-bold text-neutral-900">
                Log out?
              </DialogTitle>

              {/* Description */}
              <DialogDescription className="mb-8 text-base text-neutral-500 leading-[160%]">
                You&apos;ll need to sign in again to access your account.
              </DialogDescription>

              {/* Cancel Link */}
              <button
                onClick={onClose}
                disabled={isLoading}
                className="mb-3 text-base font-semibold text-neutral-900 hover:underline disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Logout Button */}
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="h-12 w-full rounded-xl border-[1.5px] border-neutral-900 bg-error-100 text-base font-semibold text-neutral-900 transition-colors hover:bg-error-100/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging out..." : "Log out"}
              </button>
            </div>
          </SafeArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
