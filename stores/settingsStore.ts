import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  NotificationPreferences,
  LanguageCode
} from '@/types';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/lib/constants';

interface SettingsState {
  // Language
  language: LanguageCode;

  // Notification preferences
  notificationPreferences: NotificationPreferences;

  // Actions
  setLanguage: (language: LanguageCode) => void;
  setNotificationPreference: (
    key: keyof NotificationPreferences,
    value: boolean
  ) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'en',
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,

      setLanguage: (language) => set({ language }),

      setNotificationPreference: (key, value) => {
        const { notificationPreferences } = get();
        set({
          notificationPreferences: {
            ...notificationPreferences,
            [key]: value,
          },
        });
      },

      resetSettings: () => set({
        language: 'en',
        notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
      }),
    }),
    {
      name: 'aba-settings',
    }
  )
);
