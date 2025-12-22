import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SafeAreaInset = "all" | "x" | "y" | "top" | "bottom" | "left" | "right" | "none";

const insetClasses: Record<SafeAreaInset, string> = {
  all: "safe-area-inset",
  x: "safe-area-inset-x",
  y: "safe-area-inset-y",
  top: "safe-area-inset-top",
  bottom: "safe-area-inset-bottom",
  left: "safe-area-inset-left",
  right: "safe-area-inset-right",
  none: "",
};

type SafeAreaProps = HTMLAttributes<HTMLDivElement> & {
  inset?: SafeAreaInset;
};

export function SafeArea({ inset = "all", className, ...props }: SafeAreaProps) {
  return <div className={cn(insetClasses[inset], className)} {...props} />;
}
