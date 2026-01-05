"use client";

import { Header } from '@/components/common/Header';
import { ChevronRight, Lock, Bell, Globe, Info } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Settings" showBack />
      <div className="h-px bg-neutral-400" />

      <div className="flex-1 px-4 py-6">
        {/* Security Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-neutral-600 uppercase">
            Security
          </h2>

          <div className="rounded-xl border border-neutral-400 bg-white divide-y divide-neutral-300">
            <Link href="/settings/change-pin">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-neutral-700" />
                  <span className="text-base text-neutral-900">Change PIN</span>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-600" />
              </div>
            </Link>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-neutral-600 uppercase">
            Preferences
          </h2>

          <div className="rounded-xl border border-neutral-400 bg-white divide-y divide-neutral-300">
            <div className="flex items-center justify-between p-4 opacity-50">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-neutral-700" />
                <span className="text-base text-neutral-900">Notifications</span>
              </div>
              <span className="text-sm text-neutral-600">Coming soon</span>
            </div>

            <div className="flex items-center justify-between p-4 opacity-50">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-neutral-700" />
                <span className="text-base text-neutral-900">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">English</span>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-neutral-600 uppercase">
            About
          </h2>

          <div className="rounded-xl border border-neutral-400 bg-white divide-y divide-neutral-300">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-neutral-700" />
                <span className="text-base text-neutral-900">App Version</span>
              </div>
              <span className="text-sm text-neutral-600">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
