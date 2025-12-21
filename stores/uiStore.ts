import { create } from "zustand";

interface UIState {
  isBottomNavVisible: boolean;
  isHeaderVisible: boolean;
  activeTab: string;
  setBottomNavVisible: (visible: boolean) => void;
  setHeaderVisible: (visible: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBottomNavVisible: true,
  isHeaderVisible: true,
  activeTab: "dashboard",
  setBottomNavVisible: (visible) => set({ isBottomNavVisible: visible }),
  setHeaderVisible: (visible) => set({ isHeaderVisible: visible }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
