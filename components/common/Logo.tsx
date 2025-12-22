import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    icon: "h-5 w-5",
    text: "text-base",
    gap: "gap-1.5",
  },
  md: {
    icon: "h-7 w-7",
    text: "text-xl",
    gap: "gap-2",
  },
  lg: {
    icon: "h-10 w-10",
    text: "text-3xl",
    gap: "gap-3",
  },
};

export function Logo({ size = "md", iconOnly = false, className }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex items-center", config.gap, className)}>
      <div
        className={cn(
          "rounded-lg bg-primary-900 p-1.5 text-white flex items-center justify-center",
          config.icon
        )}
      >
        <Activity className={cn(config.icon, "stroke-2")} />
      </div>
      {!iconOnly && (
        <span className={cn("font-bold text-neutral-900", config.text)}>
          ABA Access
        </span>
      )}
    </div>
  );
}
