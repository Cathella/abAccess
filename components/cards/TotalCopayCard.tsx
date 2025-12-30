interface TotalCopayCardProps {
  totalAmount: number;
  visitCount: number;
}

export function TotalCopayCard({ totalAmount, visitCount }: TotalCopayCardProps) {
  return (
    <div className="rounded-xl bg-primary-100 p-4">
      <h3 className="mb-2 text-sm font-semibold text-neutral-900">
        Total co-pay paid
      </h3>
      <div className="mb-2 h-px bg-primary-200" />
      <p className="text-sm text-neutral-700">
        UGX {totalAmount.toLocaleString()} ({visitCount} visit{visitCount !== 1 ? "s" : ""})
      </p>
    </div>
  );
}
