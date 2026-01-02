"use client";

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ChevronRight, User, Phone, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      {/* Profile Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-900">
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-neutral-900">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-neutral-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-neutral-600">Member ID: {user.memberId}</p>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="rounded-xl border border-neutral-400 bg-white p-4">
          <h2 className="mb-3 text-base font-semibold text-neutral-900">Basic Information</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-neutral-600" />
                <span className="text-sm text-neutral-900">Full Name</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">
                {user.firstName} {user.lastName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-neutral-600" />
                <span className="text-sm text-neutral-900">Phone</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">{user.phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-neutral-600" />
                <span className="text-sm text-neutral-900">NIN</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">
                {user.nin || 'Not provided'}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/profile/edit"
              className="flex h-10 items-center justify-center rounded-xl border-[1.5px] border-neutral-900 bg-primary-100 text-base font-semibold text-neutral-900"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-neutral-400 bg-white p-4">
          <h2 className="mb-3 text-base font-semibold text-neutral-900">Security</h2>

          <Link href="/settings/change-pin">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-neutral-600" />
                <span className="text-sm text-neutral-900">Change PIN</span>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-600" />
            </div>
          </Link>
        </div>

        {/* Settings */}
        <div className="rounded-xl border border-neutral-400 bg-white p-4">
          <Link href="/settings">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-neutral-900">Settings</span>
              <ChevronRight className="h-5 w-5 text-neutral-600" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
