import { Logo } from "./Logo";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  text?: string;
  className?: string;
}

export function LoadingScreen({ text, className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-900" />
          {text && (
            <p className="text-sm text-neutral-600 animate-pulse">{text}</p>
          )}
        </div>
      </div>
    </div>
  );
}
