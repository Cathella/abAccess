import React from "react";

interface ResultScreenProps {
  emoji: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  primaryAction: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  emoji,
  title,
  subtitle,
  children,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        {/* Large emoji */}
        <div className="text-6xl mb-6">{emoji}</div>

        {/* Title */}
        <h1 className="text-xl font-bold text-neutral-900 mb-6 text-center">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-neutral-700 text-center mb-6 max-w-sm">
            {subtitle}
          </p>
        )}

        {/* Optional children content */}
        {children && <div className="w-full max-w-md">{children}</div>}
      </div>

      {/* Bottom buttons - fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white space-y-3">
        {/* Secondary action button (optional) */}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onPress}
            className="w-full text-center font-bold text-neutral-900 py-3 transition-opacity hover:opacity-70"
          >
            {secondaryAction.label}
          </button>
        )}

        {/* Primary action button */}
        <button
          onClick={primaryAction.onPress}
          className="w-full h-12 rounded-xl font-bold border-[1.5px] border-neutral-900 transition-colors"
          style={{
            backgroundColor: "#32C28A",
            color: "#1A1A1A",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2AAA75";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#32C28A";
          }}
        >
          {primaryAction.label}
        </button>
      </div>
    </div>
  );
};
