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
    ? `flex w-full items-center gap-4 py-3 transition-colors hover:bg-gray-50 ${
        showDivider ? "border-b border-gray-200" : ""
      }`
    : `flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50`;

  return (
    <Link
      href={`/packages/${category.id}`}
      onClick={onPress}
      className={containerClasses}
    >
      {/* Left: Circular mint background with emoji */}
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F4F1]">
        <span className="text-3xl">{category.emoji}</span>
      </div>

      {/* Center: Category name and description */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        <p className="text-sm text-gray-500">{category.description}</p>
      </div>

      {/* Right: Chevron icon */}
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" />
    </Link>
  );
}
