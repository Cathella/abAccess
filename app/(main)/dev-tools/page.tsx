"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  seedAllTestData,
  clearAllTestData,
  getTestDataStatus,
  seedAuthStore,
  seedWalletStore,
  seedPackageStore,
  seedFamilyStore,
  seedVisitsStore,
} from "@/lib/testData/seedAll";
import { usePackageStore } from "@/stores/packageStore";
import { useAuthStore } from "@/stores";
import type { User, WalletTransaction, SavedPaymentMethod } from "@/types";

interface WalletStorageData {
  state: {
    balance: number;
    transactions: WalletTransaction[];
    savedPaymentMethods: SavedPaymentMethod[];
    isLoading: boolean;
    isProcessing: boolean;
    transactionFilter: string;
  };
  version: number;
}

export default function DevToolsPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [walletData, setWalletData] = useState<WalletStorageData | null>(null);

  const userPackages = usePackageStore((state) => state.userPackages);

  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  // Seed all stores at once
  const handleSeedAllData = () => {
    const result = seedAllTestData();
    setMessage(
      `✅ All data seeded!\n` +
      `👤 User: ${result.user.firstName} ${result.user.lastName}\n` +
      `💰 Wallet: UGX ${result.wallet.balance.toLocaleString()}\n` +
      `📦 Packages: ${result.packages.length}\n` +
      `👨‍👩‍👧‍👦 Dependents: ${result.dependents.length}\n` +
      `📅 Visits: ${result.visits.total}`
    );
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  // Clear all data
  const handleClearAllData = () => {
    clearAllTestData();
    setMessage("🗑️ All test data cleared!");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleSeedIndividual = (type: 'wallet' | 'packages' | 'family' | 'auth' | 'visits') => {
    switch (type) {
      case 'wallet':
        seedWalletStore();
        setMessage("✅ Wallet data seeded!");
        break;
      case 'packages':
        seedPackageStore();
        setMessage("✅ Package data seeded!");
        break;
      case 'family':
        seedFamilyStore();
        setMessage("✅ Family data seeded!");
        break;
      case 'auth':
        seedAuthStore();
        setMessage("✅ Auth data seeded!");
        break;
      case 'visits':
        const visitsResult = seedVisitsStore();
        setMessage(`✅ Visits data seeded!\n📅 ${visitsResult.total} visits loaded`);
        break;
    }
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleViewStatus = () => {
    const status = getTestDataStatus();
    setMessage(
      `📊 Data Status:\n` +
      `Auth: ${status.hasAuth ? '✅' : '❌'}\n` +
      `Wallet: ${status.hasWallet ? '✅' : '❌'}\n` +
      `Packages: ${status.hasPackages ? '✅' : '❌'}\n` +
      `Family: ${status.hasFamily ? '✅' : '❌'}\n` +
      `Visits: ${status.hasVisits ? '✅' : '❌'}`
    );
  };

  const handleSignOut = () => {
    signOut();
    setMessage("🔓 Signed out successfully!");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 px-6 py-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Development Tools
        </h1>

        <p className="text-base text-neutral-600 mb-8">
          Tools for testing and development. These actions will affect your local storage.
        </p>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>

          <div className="space-y-3">
            <button
              onClick={handleSeedAllData}
              className="w-full h-14 rounded-xl bg-primary-900 text-base font-bold text-white border-[1.5px] border-neutral-900 transition-colors hover:bg-primary-800"
            >
              🌱 Seed All Test Data
            </button>

            <button
              onClick={handleClearAllData}
              className="w-full h-12 rounded-xl bg-error-100 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-error-200"
            >
              🗑️ Clear All Data
            </button>

            <button
              onClick={handleViewStatus}
              className="w-full h-12 rounded-xl bg-secondary-100 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-secondary-200"
            >
              📊 View Data Status
            </button>
          </div>
        </div>

        {/* Auth Status */}
        <div className="mb-8 rounded-xl bg-neutral-100 p-4 border border-neutral-400">
          <h3 className="text-base font-bold text-neutral-900 mb-2">Current User</h3>
          {user ? (
            <div className="space-y-1">
              <p className="text-sm text-neutral-600">
                Name: <span className="font-semibold text-neutral-900">{user.firstName} {user.lastName}</span>
              </p>
              <p className="text-sm text-neutral-600">
                Member ID: <span className="font-semibold text-neutral-900">{user.memberId}</span>
              </p>
              <p className="text-sm text-neutral-600">
                Phone: <span className="font-semibold text-neutral-900">{user.phone}</span>
              </p>
              <button
                onClick={handleSignOut}
                className="mt-2 text-sm text-error-900 font-semibold hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">Not authenticated</p>
          )}
        </div>

        {/* Individual Seed Tools */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Individual Seed Tools</h2>

          <div className="space-y-3">
            <button
              onClick={() => handleSeedIndividual('auth')}
              className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
            >
              👤 Seed Auth Only
            </button>

            <button
              onClick={() => handleSeedIndividual('wallet')}
              className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
            >
              💰 Seed Wallet Only
            </button>

            <button
              onClick={() => handleSeedIndividual('packages')}
              className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
            >
              📦 Seed Packages Only
            </button>

            <button
              onClick={() => handleSeedIndividual('family')}
              className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
            >
              👨‍👩‍👧‍👦 Seed Family Only
            </button>

            <button
              onClick={() => handleSeedIndividual('visits')}
              className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
            >
              📅 Seed Visits Only
            </button>
          </div>
        </div>

        {/* Current Data Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Current Data</h2>

          <div className="rounded-xl bg-neutral-100 p-4 border border-neutral-400 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Active Packages:</span>
              <span className="font-semibold text-neutral-900">
                {userPackages.filter(p => p.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Total Packages:</span>
              <span className="font-semibold text-neutral-900">{userPackages.length}</span>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 rounded-xl bg-primary-100 p-4 border border-neutral-400">
            <p className="text-base text-neutral-900 whitespace-pre-line">{message}</p>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 rounded-xl bg-secondary-100 p-4">
          <div className="flex items-start gap-2">
            <span className="text-lg">ℹ️</span>
            <div>
              <p className="text-sm text-neutral-900 leading-relaxed">
                <strong>Comprehensive Test Data includes:</strong>
              </p>

              <p className="text-sm text-neutral-900 leading-relaxed mt-3">
                <strong>👤 Auth User:</strong>
              </p>
              <ul className="mt-1 ml-4 text-sm text-neutral-700 space-y-1">
                <li>• Name: Catherine Nakitto</li>
                <li>• Phone: +256782087786</li>
                <li>• Member ID: A-123456</li>
                <li>• PIN: 1234 (for testing wallet payments)</li>
              </ul>

              <p className="text-sm text-neutral-900 leading-relaxed mt-3">
                <strong>💰 Wallet:</strong>
              </p>
              <ul className="mt-1 ml-4 text-sm text-neutral-700 space-y-1">
                <li>• Balance: UGX 190,000</li>
                <li>• 4 transactions (2 top-ups, 2 purchases)</li>
                <li>• 2 saved payment methods (MTN, Airtel)</li>
              </ul>

              <p className="text-sm text-neutral-900 leading-relaxed mt-3">
                <strong>📦 Packages:</strong>
              </p>
              <ul className="mt-1 ml-4 text-sm text-neutral-700 space-y-1">
                <li>• 2 Active packages (5 Visits, 3 Tests)</li>
                <li>• 1 Completed package (3 Visits)</li>
                <li>• Full usage history with multiple visits</li>
              </ul>

              <p className="text-sm text-neutral-900 leading-relaxed mt-3">
                <strong>👨‍👩‍👧‍👦 Family:</strong>
              </p>
              <ul className="mt-1 ml-4 text-sm text-neutral-700 space-y-1">
                <li>• 3 dependents (Ben, 6 years; Sarah, 4 years; Michael, 2 years)</li>
                <li>• All with birth certificates</li>
              </ul>

              <p className="text-sm text-neutral-900 leading-relaxed mt-3">
                <strong>📅 Visits:</strong>
              </p>
              <ul className="mt-1 ml-4 text-sm text-neutral-700 space-y-1">
                <li>• 15 total visit records</li>
                <li>• 5 upcoming visits (3 confirmed, 2 pending)</li>
                <li>• 6 completed visits</li>
                <li>• 4 canceled/no-show visits</li>
              </ul>

              <p className="text-xs text-neutral-600 leading-relaxed mt-4 italic">
                Note: Page will reload automatically after seeding to apply changes.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 space-y-3">
          {user && (
            <>
              <button
                onClick={() => router.push("/packages")}
                className="w-full h-12 rounded-xl bg-primary-100 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-primary-200"
              >
                🛒 Browse Packages
              </button>
              <button
                onClick={() => router.push("/my-packages")}
                className="w-full h-12 rounded-xl bg-secondary-100 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-secondary-200"
              >
                📦 My Packages
              </button>
              <button
                onClick={() => router.push("/wallet")}
                className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
              >
                💰 Wallet
              </button>
              <button
                onClick={() => router.push("/family")}
                className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
              >
                👨‍👩‍👧‍👦 Family
              </button>
              <button
                onClick={() => router.push("/visits")}
                className="w-full h-12 rounded-xl bg-white text-base font-semibold text-neutral-900 border-[1.5px] border-neutral-400 transition-colors hover:bg-neutral-50"
              >
                📅 Visits
              </button>
            </>
          )}
          <button
            onClick={() => router.push(user ? "/dashboard" : "/welcome")}
            className="w-full h-12 rounded-xl border-[1.5px] border-neutral-900 bg-white text-base font-bold text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            ← Back to {user ? "Dashboard" : "Welcome"}
          </button>
        </div>
      </div>
    </div>
  );
}
