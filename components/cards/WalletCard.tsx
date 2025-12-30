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
        "w-full rounded-4xl border border-dashed border-neutral-400 bg-white p-4",
        className
      )}
    >
      {/* Row 1: Icon + Text */}
      <div className="flex items-center gap-3">
        {/* Icon container */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
          <Wallet className="h-6 w-6 text-neutral-900" />
        </div>

        {/* Text container */}
        <div className="flex flex-col">
          <p className="text-base text-neutral-900">Wallet</p>
          <p className="text-sm text-neutral-700">
            Top up to pay for packages
          </p>
        </div>
      </div>

      {/* Row 2: Balance + Button */}
      <div className="mt-2 flex items-center justify-between">
        {/* Balance */}
        <div className="flex items-center gap-1">
          <span className="text-[24px] font-bold text-neutral-900 leading-none">
            {formattedBalance}
          </span>
          <span className="text-base font-medium text-neutral-700">UGX</span>
        </div>

        {/* Top up Button */}
        <button
          onClick={onTopUp}
          className="h-10 rounded-xl border-[1.5px] border-neutral-900 bg-primary-900 px-5 text-base font-semibold text-neutral-900 hover:bg-primary-800"
        >
          Top up
        </button>
      </div>
    </div>
  );
}
