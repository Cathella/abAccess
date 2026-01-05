"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CategoryInfo } from "@/types";

interface CategoryCardProps {
  category: CategoryInfo;
  onPress: () => void;
  showDivider?: boolean;
  variant?: "card" | "inline";
}

export function CategoryCard({
  category,
  onPress,
  showDivider = true,
  variant = "card"
}: CategoryCardProps) {
  const containerClasses = variant === "inline"
    ? `flex w-full items-center gap-4 py-5 transition-colors hover:bg-neutral-100 ${
        showDivider ? "border-b border-neutral-400" : ""
      }`
    : `flex w-full items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 transition-colors hover:bg-neutral-50`;

  return (
    <Link
      href={`/packages/${category.id}`}
      onClick={onPress}
      className={containerClasses}
    >
      {/* Left: Circular mint background with emoji */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100">
        <span className="text-2xl">{category.emoji}</span>
      </div>

      {/* Center: Category name and description */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900 text-base">{category.name}</h3>
        <p className="text-sm mt-1 text-neutral-700">{category.description}</p>
      </div>

      {/* Right: Chevron icon */}
      <ChevronRight className="h-5 w-5 shrink-0 text-neutral-700" />
    </Link>
  );
}
