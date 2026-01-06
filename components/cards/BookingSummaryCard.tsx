interface BookingDetail {
  label: string;
  value: string;
}

interface BookingSummaryCardProps {
  packageCategory: string;
  packageName: string;
  details: BookingDetail[];
}

export function BookingSummaryCard({
  packageCategory,
  packageName,
  details,
}: BookingSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-400 bg-white shadow-sm p-4">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="font-bold text-xl text-neutral-900">
          {packageCategory}
        </h2>
        <p className="text-gray-500 mt-1">
          {packageName}
        </p>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 my-4" />

      {/* Details Section */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="space-y-1">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between py-1">
              <span className="text-gray-500">
                {detail.label}
              </span>
              <span className="text-gray-900 font-medium text-right">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
