'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PACKAGE_CATEGORIES, AVAILABLE_PACKAGES } from '@/lib/constants';
import { BrowsePackageCategory } from '@/types';
import PackageListCard from '@/components/cards/PackageListCard';
import InfoCard from '@/components/common/InfoCard';

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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="bg-white rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Category Not Found
            </h2>
            <p className="text-gray-600">
              The category you're looking for doesn't exist or has no packages available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handlePackagePress = (packageId: string) => {
    router.push(`/packages/${categoryId}/${packageId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {categoryInfo.name}
          </h1>
          <p className="text-gray-600">
            {categoryInfo.description}. Share across your whole family.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Package List */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
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
    </div>
  );
}
