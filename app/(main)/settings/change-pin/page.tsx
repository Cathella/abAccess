"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/common/Header';
import { PinInput } from '@/components/forms/PinInput';
import * as userService from '@/lib/services/userService';

type PinStep = 'current' | 'new' | 'confirm';

export default function ChangePinPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [step, setStep] = useState<PinStep>('current');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCurrentPinComplete = async (pin: string) => {
    if (!user?.id) return;

    setCurrentPin(pin);
    setIsLoading(true);
    setError('');

    try {
      const result = await userService.verifyCurrentPin(user.id, pin);

      if (result.success && result.data) {
        setStep('new');
      } else {
        setError('Incorrect PIN');
        setCurrentPin('');
      }
    } catch {
      setError('Network error');
      setCurrentPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPinComplete = (pin: string) => {
    setNewPin(pin);
    setStep('confirm');
  };

  const handleConfirmPinComplete = async (pin: string) => {
    if (!user?.id) return;

    setConfirmPin(pin);

    if (pin !== newPin) {
      setError('PINs do not match');
      setConfirmPin('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await userService.updateUserPin(user.id, currentPin, newPin);

      if (result.success && result.data) {
        setUser(result.data);
        router.push('/settings');
      } else {
        setError(result.error || 'Failed to change PIN');
        setStep('current');
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
      }
    } catch {
      setError('Network error');
      setStep('current');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="Change PIN" showBack />
      <div className="h-px bg-neutral-400" />

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {step === 'current' && (
          <div className="w-full max-w-md text-center">
            <h1 className="text-xl font-bold mb-2 text-neutral-900">Enter current PIN</h1>
            <p className="text-neutral-600 mb-8">Enter your 4-digit PIN</p>
            <PinInput
              length={4}
              onComplete={handleCurrentPinComplete}
              error={error}
              disabled={isLoading}
              value={currentPin}
            />
          </div>
        )}

        {step === 'new' && (
          <div className="w-full max-w-md text-center">
            <h1 className="text-xl font-bold mb-2 text-neutral-900">Enter new PIN</h1>
            <p className="text-neutral-600 mb-8">Choose a secure 4-digit PIN</p>
            <PinInput
              length={4}
              onComplete={handleNewPinComplete}
              disabled={isLoading}
              value={newPin}
            />
          </div>
        )}

        {step === 'confirm' && (
          <div className="w-full max-w-md text-center">
            <h1 className="text-xl font-bold mb-2 text-neutral-900">Confirm new PIN</h1>
            <p className="text-neutral-600 mb-8">Re-enter your new PIN</p>
            <PinInput
              length={4}
              onComplete={handleConfirmPinComplete}
              error={error}
              disabled={isLoading}
              value={confirmPin}
            />
          </div>
        )}

        {isLoading && (
          <div className="mt-4 text-sm text-neutral-600">Processing...</div>
        )}
      </div>
    </div>
  );
}
