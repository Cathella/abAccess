// App Constants

import type { CategoryInfo, AvailablePackage, BrowsePackageCategory } from "@/types";

export const APP_NAME = "ABA Access";
export const APP_VERSION = "1.0.0";

// Design System - Colors

export const colors = {
  primary: {
    900: "#32C28A",
    800: "#3ACD93",
    700: "#56D8A8",
    100: "#DFF7EE",
  },
  secondary: {
    900: "#3A8DFF",
    100: "#E8F2FF",
  },
  brandRose: {
    900: "#F23D7A",
    700: "#FF7AA8",
    100: "#FFE6EF",
  },
  neutral: {
    900: "#1A1A1A",
    800: "#2E2E2E",
    700: "#4A4F55",
    600: "#8F9AA1",
    500: "#C9D0DB",
    400: "#E5E8EC",
    300: "#EEF0F3",
    200: "#F7F9FC",
    100: "#FFFFFF",
  },
  success: {
    900: "#38C172",
    100: "#E9F8F0",
  },
  warning: {
    900: "#FFB649",
    100: "#FFF3DC",
  },
  error: {
    900: "#E44F4F",
    100: "#FDECEC",
  },
} as const;

// Design System - Typography

export const typography = {
  h1: {
    size: "48px",
    lineHeight: "auto",
    weight: 700,
  },
  h2: {
    size: "24px",
    lineHeight: "160%",
    weight: 700,
  },
  h3: {
    size: "20px",
    lineHeight: "auto",
    weight: 700,
  },
  bold: {
    size: "16px",
    lineHeight: "160%",
    weight: 700,
  },
  body: {
    size: "16px",
    lineHeight: "160%",
    weight: 400,
  },
  smBold: {
    size: "14px",
    lineHeight: "140%",
    weight: 700,
  },
  smBody: {
    size: "14px",
    lineHeight: "140%",
    weight: 400,
  },
} as const;

// API Constants
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const PIN_LENGTH = 4;
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Storage Keys
export const STORAGE_KEYS = {
  USER: "user",
  AUTH_TOKEN: "auth_token",
  OFFLINE_DATA: "offline_data",
} as const;

// Routes
export const ROUTES = {
  WELCOME: "/welcome",
  SIGN_IN: "/sign-in",
  ENTER_PIN: "/enter-pin",
  VERIFY_OTP: "/verify-otp",
  CREATE_PIN: "/create-pin",
  FORGOT_PIN: "/forgot-pin",
  ONBOARDING: "/onboarding",
  REGISTER: "/register",
  REGISTER_INFO: "/register/info",
  REGISTER_NIN: "/register/nin",
  REGISTER_PIN: "/register/pin",
  REGISTER_SUCCESS: "/register/success",
  DASHBOARD: "/dashboard",
  PACKAGES: "/packages",
  MY_PACKAGES: "/my-packages",
  VISITS: "/visits",
  WALLET: "/wallet",
  PROFILE: "/profile",
  FAMILY: "/family",
  FAMILY_ADD: "/family/add",
  FAMILY_ADD_SUCCESS: "/family/add/success",
  FAMILY_DETAIL: (id: string) => `/family/${id}`,
  NOTIFICATIONS: "/notifications",
} as const;

// Browse Packages Feature Constants

export const PACKAGE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'consultations',
    name: 'Consultations',
    description: 'GP visits at partner clinics',
    emoji: '👩‍⚕️',
  },
  {
    id: 'lab_tests',
    name: 'Lab Tests',
    description: 'Diagnostics at partner labs',
    emoji: '🔬',
  },
  {
    id: 'maternal_care',
    name: 'Maternal Care',
    description: 'Antenatal visits & scans',
    emoji: '🤱',
  },
  {
    id: 'child_wellness',
    name: 'Child Wellness',
    description: 'Pediatric checkups & vaccinations',
    emoji: '👶',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Medication pickups',
    emoji: '💊',
  },
];

// Mock packages data for each category
export const AVAILABLE_PACKAGES: Record<BrowsePackageCategory, AvailablePackage[]> = {
  consultations: [
    {
      id: 'cons-3',
      categoryId: 'consultations',
      name: '3 Visits Pack',
      price: 45000,
      visits: 3,
      copay: 5000,
      validityDays: 30,
      totalValue: 54000,
      savingsPercent: 12,
      partnerCount: 24,
      inclusions: [
        '3 GP consultations',
        'Valid at 24 partner clinics',
        'Shared across your family',
        'Valid for 30 days from purchase',
      ],
    },
    {
      id: 'cons-5',
      categoryId: 'consultations',
      name: '5 Visits Pack',
      price: 65000,
      visits: 5,
      copay: 5000,
      validityDays: 30,
      totalValue: 90000,
      savingsPercent: 17,
      partnerCount: 24,
      isBestValue: true,
      inclusions: [
        '5 GP consultations',
        'Valid at 24 partner clinics',
        'Shared across your family',
        'Valid for 30 days from purchase',
      ],
    },
    {
      id: 'cons-10',
      categoryId: 'consultations',
      name: '10 Visits Pack',
      price: 110000,
      visits: 10,
      copay: 5000,
      validityDays: 30,
      totalValue: 150000,
      savingsPercent: 22,
      partnerCount: 24,
      inclusions: [
        '10 GP consultations',
        'Valid at 24 partner clinics',
        'Shared across your family',
        'Valid for 30 days from purchase',
      ],
    },
  ],
  lab_tests: [
    {
      id: 'lab-3',
      categoryId: 'lab_tests',
      name: '3 Tests Pack',
      price: 75000,
      visits: 3,
      copay: 10000,
      validityDays: 30,
      totalValue: 105000,
      savingsPercent: 15,
      partnerCount: 12,
      inclusions: [
        '3 lab tests',
        'Valid at 12 partner labs',
        'Shared across your family',
        'Valid for 30 days from purchase',
      ],
    },
  ],
  maternal_care: [
    {
      id: 'mat-4',
      categoryId: 'maternal_care',
      name: '4 Visits Pack',
      price: 120000,
      visits: 4,
      copay: 10000,
      validityDays: 60,
      totalValue: 160000,
      savingsPercent: 20,
      partnerCount: 8,
      isBestValue: true,
      inclusions: [
        '4 antenatal visits',
        'Valid at 8 partner facilities',
        'Includes basic scans',
        'Valid for 60 days from purchase',
      ],
    },
  ],
  child_wellness: [
    {
      id: 'child-3',
      categoryId: 'child_wellness',
      name: '3 Visits Pack',
      price: 55000,
      visits: 3,
      copay: 5000,
      validityDays: 30,
      totalValue: 70000,
      savingsPercent: 15,
      partnerCount: 18,
      inclusions: [
        '3 pediatric checkups',
        'Valid at 18 partner clinics',
        'For children under 18',
        'Valid for 30 days from purchase',
      ],
    },
  ],
  pharmacy: [
    {
      id: 'pharm-5',
      categoryId: 'pharmacy',
      name: '5 Pickups Pack',
      price: 25000,
      visits: 5,
      copay: 0,
      validityDays: 30,
      totalValue: 35000,
      savingsPercent: 18,
      partnerCount: 30,
      inclusions: [
        '5 medication pickups',
        'Valid at 30 partner pharmacies',
        'Shared across your family',
        'Valid for 30 days from purchase',
      ],
    },
  ],
};
