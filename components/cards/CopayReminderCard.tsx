interface CopayReminderCardProps {
  copayAmount: number;
}

export function CopayReminderCard({ copayAmount }: CopayReminderCardProps) {
  return (
    <div className="rounded-xl bg-primary-100 p-4">
      <h3 className="mb-2 text-sm font-semibold text-neutral-900">
        Co-pay reminder
      </h3>
      <div className="mb-2 h-px bg-primary-200" />
      <p className="text-sm leading-[160%] text-neutral-700">
        You&apos;ll pay UGX {copayAmount.toLocaleString()} at the facility
        during each visit.
      </p>
    </div>
  );
}
