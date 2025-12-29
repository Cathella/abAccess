"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { seedWalletData, clearWalletData, getWalletData } from "@/lib/utils/seedWallet";
import { Header } from "@/components/common/Header";

export default function DevToolsPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [walletData, setWalletData] = useState<any>(null);

  const handleSeedWallet = () => {
    const data = seedWalletData();
    setMessage(`✅ Wallet seeded! Balance: UGX ${data.balance.toLocaleString()}, Transactions: ${data.transactions.length}`);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleClearWallet = () => {
    clearWalletData();
    setMessage("🗑️ Wallet data cleared!");
    setWalletData(null);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleViewData = () => {
    const data = getWalletData();
    setWalletData(data);
    if (data) {
      setMessage(`📊 Wallet data loaded`);
    } else {
      setMessage("⚠️ No wallet data found");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Dev Tools" showBack />
      <div className="h-px bg-neutral-400" />

      <div className="flex-1 px-6 py-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Development Tools
        </h1>

        <p className="text-base text-neutral-600 mb-8">
          Tools for testing and development. These actions will affect your local storage.
        </p>

        {/* Wallet Tools */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Wallet Tools</h2>

          <div className="space-y-3">
            <button
              onClick={handleSeedWallet}
              className="w-full h-12 rounded-xl bg-primary-900 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-primary-800"
            >
              🌱 Seed Wallet Data
            </button>

            <button
              onClick={handleClearWallet}
              className="w-full h-12 rounded-xl bg-error-100 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-error-200"
            >
              🗑️ Clear Wallet Data
            </button>

            <button
              onClick={handleViewData}
              className="w-full h-12 rounded-xl bg-secondary-100 text-base font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors hover:bg-secondary-200"
            >
              📊 View Current Data
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 rounded-xl bg-primary-100 p-4 border border-neutral-400">
            <p className="text-base text-neutral-900">{message}</p>
          </div>
        )}

        {/* Data Display */}
        {walletData && (
          <div className="rounded-xl bg-neutral-100 p-4 border border-neutral-400">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">Wallet Data</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Balance:</span>
                <span className="font-semibold text-neutral-900">
                  UGX {walletData.state.balance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Transactions:</span>
                <span className="font-semibold text-neutral-900">
                  {walletData.state.transactions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Saved Methods:</span>
                <span className="font-semibold text-neutral-900">
                  {walletData.state.savedPaymentMethods.length}
                </span>
              </div>
            </div>

            {/* Transactions Preview */}
            {walletData.state.transactions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-300">
                <h4 className="text-base font-bold text-neutral-900 mb-2">Recent Transactions</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {walletData.state.transactions.slice(0, 5).map((txn: any) => (
                    <div key={txn.id} className="text-xs p-2 bg-white rounded border border-neutral-300">
                      <div className="flex justify-between mb-1">
                        <span className={`font-semibold ${txn.type === 'top_up' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'top_up' ? '+ ' : '- '}
                          UGX {txn.amount.toLocaleString()}
                        </span>
                        <span className="text-neutral-600">{txn.transactionId}</span>
                      </div>
                      <div className="text-neutral-500">
                        {new Date(txn.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 rounded-xl bg-secondary-100 p-4">
          <div className="flex items-start gap-2">
            <span className="text-lg">ℹ️</span>
            <div>
              <p className="text-sm text-neutral-900 leading-relaxed">
                <strong>Note:</strong> Seeding wallet data will:
              </p>
              <ul className="mt-2 ml-4 text-sm text-neutral-700 space-y-1">
                <li>• Add 8 sample transactions (5 top-ups, 3 purchases)</li>
                <li>• Set balance to UGX 255,000</li>
                <li>• Add 3 saved payment methods (MTN, Airtel, Visa)</li>
                <li>• Reload the page to apply changes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-12 rounded-xl border-[1.5px] border-neutral-900 bg-white text-base font-bold text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
