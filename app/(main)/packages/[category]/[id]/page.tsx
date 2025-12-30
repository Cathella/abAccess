'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PACKAGE_CATEGORIES, AVAILABLE_PACKAGES } from '@/lib/constants';
import { BrowsePackageCategory } from '@/types';
import { usePurchaseStore } from '@/stores/purchaseStore';
import InclusionsList from '@/components/common/InclusionsList';

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
              Package Not Found
            </h2>
            <p className="text-gray-600">
              The package you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
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
    router.push('/packages/purchase/recipient');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Package details</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Main Pricing Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* Package Info */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-gray-900">
              {categoryInfo.name}
            </h1>
            <p className="text-gray-500">{pkg.name}</p>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            {/* What you pay now */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">What you pay now</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(pkg.price)}
              </span>
            </div>

            <div className="border-t border-gray-200" />

            {/* What you pay per visit */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">What you pay per visit</span>
              <span className="font-semibold text-gray-900">
                {pkg.copay > 0 ? `${formatCurrency(pkg.copay)} co-pay` : 'No co-pay'}
              </span>
            </div>

            <div className="border-t border-gray-200" />

            {/* Total value */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total value</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(pkg.totalValue)}
              </span>
            </div>
          </div>

          {/* Savings Badge */}
          {pkg.savingsPercent > 0 && (
            <div className="flex justify-center">
              <span
                className="px-4 py-2 rounded-full text-sm font-medium"
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
          <h2 className="font-semibold text-gray-900">What's included</h2>
          <InclusionsList items={pkg.inclusions} />
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleBuyPackage}
            className="w-full py-4 rounded-xl font-semibold text-white transition-colors"
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
    </div>
  );
}
