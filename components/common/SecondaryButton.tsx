import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function SecondaryButton({
  href,
  onClick,
  children,
  className,
  disabled = false,
  type = "button",
}: SecondaryButtonProps) {
  const buttonClasses = cn(
    "h-12 w-full rounded-xl border-2 border-neutral-900 bg-primary-100 text-base font-semibold text-neutral-900 hover:bg-primary-100/80",
    className
  );

  if (href) {
    return (
      <Button asChild variant="outline" size="lg" className={buttonClasses}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </Button>
  );
}
