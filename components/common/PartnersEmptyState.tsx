"use client";

interface PartnersEmptyStateProps {
  onEnableLocation: () => void;
}

export function PartnersEmptyState({
  onEnableLocation,
}: PartnersEmptyStateProps) {
  return (
    <div className="flex w-full items-center justify-center px-8 py-8 border-dashed border bg-neutral-200 border-neutral-400 rounded-4xl">
      <div className="flex flex-col items-center text-center">
        {/* Hospital Icon */}
        <div className="text-4xl mb-6">🏥</div>

        {/* Description text */}
        <p className="text-base text-neutral-700 max-w-xs mx-auto mb-6">
          Enable location or select your area manually
        </p>

        {/* Primary button - Enable Location */}
        <button
          onClick={onEnableLocation}
          className="bg-primary-100 border-[1.5px] border-neutral-900 rounded-xl font-semibold text-neutral-900 px-4 h-10 mb-4 transition-colors hover:bg-primary-900"
        >
          Enter your location
        </button>

        {/* Secondary link - Select area manually */}
        {/* <button
          onClick={onSelectManually}
          className="text-base font-medium text-secondary-900 underline hover:no-underline"
        >
          Select area manually
        </button> */}
      </div>
    </div>
  );
}
