"use client";

import { Header } from "@/components/common/Header";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { PACKAGE_CATEGORIES } from "@/lib/constants";

export default function BrowsePackagesPage() {
  return (
    <>
      {/* Header with back button */}
      <Header title="Browse packages" showBack />

      {/* Main content */}
      <div className="px-4 pt-6 pb-8 space-y-4">
        {/* Page title and subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Packages
          </h1>
          <p className="text-gray-600">
            Save on healthcare with prepaid visit packages for you and your family.
          </p>
        </div>

        {/* Categories container - single white card with all categories inside */}
        <div className="rounded-2xl bg-white border border-neutral-400 px-4">
          {PACKAGE_CATEGORIES.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => {}}
              showDivider={index < PACKAGE_CATEGORIES.length - 1}
              variant="inline"
            />
          ))}
        </div>
      </div>
    </>
  );
}
