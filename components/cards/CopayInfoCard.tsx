interface CopayInfoCardProps {
  amount: number;
}

export default function CopayInfoCard({ amount }: CopayInfoCardProps) {
  // Format amount as UGX currency
  const formattedAmount = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="rounded-2xl bg-[#E8F4F1] p-4">
      {/* Row 1: Label + Amount */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-900">
          Co-pay due at facility
        </span>
        <span className="font-bold text-neutral-900">
          {formattedAmount}
        </span>
      </div>

      {/* Divider */}
      <div className="my-3 border-b border-gray-200/50" />

      {/* Row 2: Payment instruction */}
      <p className="text-sm text-gray-600">
        Pay with cash or mobile money when you arrive.
      </p>
    </div>
  );
}
