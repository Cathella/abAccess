import * as React from "react";
import { cn } from "@/lib/utils";

// Heading Components

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn("text-h1 text-foreground", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: HeadingProps) {
  return (
    <h2
      className={cn("text-h2 text-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn("text-h3 text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

// Text Component with Variants

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "default" | "bold" | "small" | "small-bold";
  className?: string;
  as?: "p" | "span" | "div";
}

export function Text({
  children,
  variant = "default",
  className,
  as: Component = "p",
  ...props
}: TextProps) {
  const variantStyles = {
    default: "text-body",
    bold: "text-bold",
    small: "text-sm-body",
    "small-bold": "text-sm-bold",
  };

  return (
    <Component
      className={cn(variantStyles[variant], "text-foreground", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// Muted Text Variant (commonly used for descriptions)

interface MutedProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}

export function Muted({
  children,
  className,
  as: Component = "p",
  ...props
}: MutedProps) {
  return (
    <Component
      className={cn("text-body text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// Small Muted Text (commonly used for helper text, captions)

export function Small({
  children,
  className,
  as: Component = "p",
  ...props
}: MutedProps) {
  return (
    <Component
      className={cn("text-sm-body text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// Lead Text (for introductory text, slightly larger and muted)

export function Lead({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-bold text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// Inline Code

export function InlineCode({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm-body font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

// Blockquote

export function Blockquote({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-primary pl-6 text-body italic text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}

// List Components

export function List({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc text-body [&>li]:mt-2", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function OrderedList({
  children,
  className,
  ...props
}: React.OlHTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn("my-6 ml-6 list-decimal text-body [&>li]:mt-2", className)}
      {...props}
    >
      {children}
    </ol>
  );
}
