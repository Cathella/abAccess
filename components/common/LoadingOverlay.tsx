interface LoadingOverlayProps {
  text?: string;
}

export function LoadingOverlay({ text = "Signing in..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <svg
            className="animate-spin"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#3A8DFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="140 44"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <p className="mt-6 text-lg font-semibold text-neutral-900">
          {text}
        </p>
      </div>
    </div>
  );
}
