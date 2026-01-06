'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PACKAGE_CATEGORIES, AVAILABLE_PACKAGES } from '@/lib/constants';
import { BrowsePackageCategory } from '@/types';
import { usePurchaseStore } from '@/stores/purchaseStore';
import InclusionsList from '@/components/common/InclusionsList';
import { Header } from '@/components/common/Header';

export default function PackageDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.category as BrowsePackageCategory;
  const packageId = params.id as string;

  const setSelectedPackage = usePurchaseStore((state) => state.setSelectedPackage);

  // Find category info
  const categoryInfo = PACKAGE_CATEGORIES.find((cat) => cat.id === categoryId);

  // Find package
  const packages = AVAILABLE_PACKAGES[categoryId] || [];
  const pkg = packages.find((p) => p.id === packageId);

  // Handle invalid package
  if (!categoryInfo || !pkg) {
    return (
      <>
        <Header title="Package details" showBack />
        <div className="px-4 pt-6 pb-8">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Package Not Found
            </h2>
            <p className="text-neutral-600">
              The package you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('UGX', 'UGX');
  };

  const handleBuyPackage = () => {
    setSelectedPackage(pkg);
    router.push('/packages/purchase/confirm');
  };

  return (
    <>
      {/* Header with back button */}
      <Header title="Package details" showBack />

      {/* Content */}
      <div className="px-4 pt-6 pb-24 space-y-4">
        {/* Main Pricing Card */}
        <div className="rounded-2xl border border-neutral-400 p-6 space-y-6">
          {/* Package Info */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-neutral-900">
              {categoryInfo.name}
            </h1>
            <p className="text-neutral-700 text-sm">{pkg.name}</p>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-neutral-200 p-4 space-y-3">
            {/* What you pay now */}
            <div className="">
              <p className="text-neutral-700 text-sm mb-1">What you pay now</p>
              <p className="font-bold text-base text-neutral-900">
                {formatCurrency(pkg.price)}
              </p>
            </div>

            <div className="border-t border-neutral-400" />

            {/* What you pay per visit */}
            <div className="">
              <p className="text-neutral-700 text-sm mb-1">What you pay per visit</p>
              <p className="font-bold text-base text-neutral-900">
                {pkg.copay > 0 ? `${formatCurrency(pkg.copay)} co-pay` : 'No co-pay'}
              </p>
            </div>

            <div className="border-t border-neutral-400" />

            {/* Total value */}
            <div className="">
              <p className="text-neutral-700 text-sm mb-1">Total value</p>
              <p className="font-semibold text-neutral-900">
                {formatCurrency(pkg.totalValue)}
              </p>
            </div>
          </div>

          {/* Savings Badge */}
          {pkg.savingsPercent > 0 && (
            <div className="flex justify-center">
              <span
                className="px-4 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: '#E8F4E8',
                  color: '#2D5A2D',
                }}
              >
                You save {pkg.savingsPercent}% Off
              </span>
            </div>
          )}
        </div>

        {/* What's Included Card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ backgroundColor: '#E3F1FC' }}
        >
          <h2 className="font-semibold text-neutral-900 text-base">What&apos;s included</h2>
          <InclusionsList items={pkg.inclusions} />
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleBuyPackage}
            className="w-full h-12 rounded-xl font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors"
            style={{ backgroundColor: '#32C28A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2AAA75';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#32C28A';
            }}
          >
            Buy for {formatCurrency(pkg.price)}
          </button>
        </div>
      </div>
    </>
  );
}
