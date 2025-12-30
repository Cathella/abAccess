import React from "react";
import { Button } from "@/components/ui/button";

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
        <h1 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-center mb-6 max-w-sm">
          {subtitle}
        </p>

        {/* Optional children content */}
        {children && <div className="w-full max-w-md">{children}</div>}
      </div>

      {/* Bottom buttons - fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-400 space-y-3">
        {/* Secondary action button (optional) */}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onPress}
            className="w-full text-center font-semibold text-neutral-900 py-3"
          >
            {secondaryAction.label}
          </button>
        )}

        {/* Primary action button */}
        <Button
          onClick={primaryAction.onPress}
          className="w-full h-12 text-base font-semibold rounded-xl"
          style={{
            backgroundColor: "#E8F4F1",
            color: "#1A1A1A",
          }}
        >
          {primaryAction.label}
        </Button>
      </div>
    </div>
  );
};
