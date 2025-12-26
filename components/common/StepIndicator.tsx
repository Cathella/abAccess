import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

/**
 * Step indicator component showing dots for multi-step flows
 * Active step is highlighted in primary color, others are neutral
 */
export function StepIndicator({ totalSteps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;

        return (
          <div
            key={stepNumber}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              isActive ? "bg-primary-900" : "bg-neutral-400"
            )}
            aria-label={`Step ${stepNumber} of ${totalSteps}`}
            aria-current={isActive ? "step" : undefined}
          />
        );
      })}
    </div>
  );
}
