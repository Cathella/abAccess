"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/common/Header';
import { TextInput } from '@/components/forms/TextInput';
import * as userService from '@/lib/services/userService';

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [nin, setNin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; nin?: string }>({});

  useEffect(() => {
    if (user) {
      setName(`${user.firstName} ${user.lastName}`);
      setNin(user.nin || '');
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: { name?: string; nin?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (nin && !userService.validateNIN(nin)) {
      newErrors.nin = 'Invalid NIN format (14 alphanumeric characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const result = await userService.updateUserProfile(user.id, {
        name: name.trim(),
        nin: nin.trim() || undefined,
      });

      if (result.success && result.data) {
        setUser(result.data);
        router.back();
      } else {
        setErrors({ name: result.error || 'Failed to update profile' });
      }
    } catch {
      setErrors({ name: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Edit Profile" showBack />
      <div className="h-px bg-neutral-400" />

      <div className="flex-1 px-6 py-6 space-y-4">
        <TextInput
          label="Full Name"
          value={name}
          onChange={setName}
          error={errors.name}
          placeholder="Enter your full name"
        />

        <TextInput
          label="National ID (NIN)"
          value={nin}
          onChange={setNin}
          error={errors.nin}
          placeholder="CM12345678901234"
          helperText="14 alphanumeric characters"
        />

        <div className="text-sm text-neutral-600 mt-4">
          <div className="mb-1"><strong>Read-only fields:</strong></div>
          <div>Phone: {user?.phone}</div>
          <div>Member ID: {user?.memberId}</div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-primary-900 border-[1.5px] border-neutral-900 text-base font-bold text-neutral-900 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
