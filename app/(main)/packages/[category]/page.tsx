'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PACKAGE_CATEGORIES, AVAILABLE_PACKAGES } from '@/lib/constants';
import { BrowsePackageCategory } from '@/types';
import PackageListCard from '@/components/cards/PackageListCard';
import InfoCard from '@/components/common/InfoCard';
import { Header } from '@/components/common/Header';

export default function CategoryPackagesPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.category as BrowsePackageCategory;

  // Find category info
  const categoryInfo = PACKAGE_CATEGORIES.find((cat) => cat.id === categoryId);

  // Get packages for this category
  const packages = AVAILABLE_PACKAGES[categoryId] || [];

  // Handle invalid category
  if (!categoryInfo || packages.length === 0) {
    return (
      <>
        <Header title="Category Not Found" showBack />
        <div className="px-4 pt-6 pb-8">
          <div className="bg-white rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Category Not Found
            </h2>
            <p className="text-neutral-700">
              The category you&apos;re looking for doesn&apos;t exist or has no packages available.
            </p>
          </div>
        </div>
      </>
    );
  }

  const handlePackagePress = (packageId: string) => {
    router.push(`/packages/${categoryId}/${packageId}`);
  };

  return (
    <>
      {/* Header with back button */}
      <Header title={categoryInfo.name} showBack />

      {/* Content */}
      <div className="px-4 pt-6 pb-8 space-y-4">
        {/* Category description */}
        <p className="text-neutral-700">
          {categoryInfo.description}. Share across your whole family.
        </p>
        {/* Package List */}
        <div className="rounded-2xl border border-neutral-400 mt-6">
          {packages.map((pkg, index) => (
            <PackageListCard
              key={pkg.id}
              package={pkg}
              onPress={() => handlePackagePress(pkg.id)}
              isLast={index === packages.length - 1}
            />
          ))}
        </div>

        {/* Info Card */}
        <InfoCard title="What's co-pay?" variant="info">
          <p>
            A small fee you pay at the facility during each visit.
          </p>
        </InfoCard>
      </div>
    </>
  );
}
