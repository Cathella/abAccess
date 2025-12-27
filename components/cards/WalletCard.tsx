import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  balance: number;
  onTopUp?: () => void;
  className?: string;
}

/**
 * WalletCard - Empty State (0 balance)
 *
 * Shows the user's wallet balance on the dashboard.
 * This is the empty state design with dashed border.
 */
export function WalletCard({ balance, onTopUp, className }: WalletCardProps) {
  // Format balance with commas and 2 decimal places
  const formattedBalance = balance.toLocaleString('en-UG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={cn(
        "w-full rounded-[24px] border-2 border-dashed border-neutral-400 bg-white p-5",
        className
      )}
    >
      {/* Row 1: Icon + Text */}
      <div className="flex items-center gap-3">
        {/* Icon container */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
          <Wallet className="h-6 w-6 text-neutral-900" />
        </div>

        {/* Text container */}
        <div className="flex flex-col">
          <p className="text-base font-medium text-neutral-900">Wallet</p>
          <p className="text-sm font-normal text-neutral-600">
            Top up to pay for packages
          </p>
        </div>
      </div>

      {/* Row 2: Balance + Button */}
      <div className="mt-4 flex items-center justify-between">
        {/* Balance */}
        <div className="flex items-center gap-1">
          <span className="text-[32px] font-bold text-neutral-900 leading-none">
            {formattedBalance}
          </span>
          <span className="text-base font-medium text-neutral-600">UGX</span>
        </div>

        {/* Top up Button */}
        <button
          onClick={onTopUp}
          className="h-10 rounded-[14px] border-2 border-neutral-900 bg-[#37c189] px-5 text-base font-semibold text-neutral-900 hover:bg-[#2fa678]"
        >
          Top up
        </button>
      </div>
    </div>
  );
}
