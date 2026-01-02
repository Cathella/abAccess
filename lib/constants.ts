// App Constants

import type {
  CategoryInfo,
  AvailablePackage,
  BrowsePackageCategory,
  VisitTabFilter,
  VisitStatusType,
  VisitRecord
} from "@/types";

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

// Visit Feature Constants

export const VISIT_TAB_OPTIONS: { value: VisitTabFilter; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'canceled', label: 'Canceled' },
];

export const VISIT_STATUS_CONFIG: Record<VisitStatusType, {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  icon: 'check' | 'clock' | 'alert' | 'x';
}> = {
  pending_confirmation: {
    label: 'Pending confirmation',
    variant: 'warning',
    icon: 'clock',
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'success',
    icon: 'check',
  },
  completed: {
    label: 'Completed',
    variant: 'success',
    icon: 'check',
  },
  remotely_approved: {
    label: 'Remotely Approved',
    variant: 'success',
    icon: 'check',
  },
  canceled: {
    label: 'Canceled',
    variant: 'error',
    icon: 'alert',
  },
  no_show: {
    label: 'No-show',
    variant: 'error',
    icon: 'alert',
  },
};

// Mock visits data for development
// Current test date reference: 2026-01-02
export const MOCK_VISITS: VisitRecord[] = [
  // UPCOMING VISITS - Confirmed
  {
    id: 'visit-1',
    memberId: 'user-1',
    memberName: 'Catherine Nakitto',
    memberInitials: 'CN',
    isSelf: true,
    facilityId: 'fac-1',
    facilityName: 'City Medical Centre',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2026-01-03', // Tomorrow - tests "Tomorrow" formatting
    visitTime: '09:30 AM',
    status: 'confirmed',
    createdAt: '2026-01-02T10:00:00Z',
    updatedAt: '2026-01-02T10:00:00Z',
  },
  {
    id: 'visit-2',
    memberId: 'dep-1',
    memberName: 'Ben Were',
    memberInitials: 'BW',
    isSelf: false,
    facilityId: 'fac-2',
    facilityName: 'Mukono Family Clinic',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2026-01-06', // Within 7 days - tests "Mon, 6 Jan" formatting
    visitTime: '10:00 AM',
    status: 'confirmed',
    createdAt: '2026-01-02T11:00:00Z',
    updatedAt: '2026-01-02T11:00:00Z',
  },
  {
    id: 'visit-3',
    memberId: 'dep-2',
    memberName: 'Sarah Namugga',
    memberInitials: 'SN',
    isSelf: false,
    facilityId: 'fac-3',
    facilityName: 'Kampala International Medical Center and Specialist Hospital',
    packageId: 'pkg-2',
    packageCategory: 'Lab Tests',
    packageName: '10 tests pack',
    visitDate: '2026-01-08', // Within 7 days - tests week formatting
    visitTime: '2:30 PM',
    status: 'confirmed',
    createdAt: '2026-01-01T15:00:00Z',
    updatedAt: '2026-01-02T09:00:00Z',
  },

  // UPCOMING VISITS - Pending Confirmation
  {
    id: 'visit-4',
    memberId: 'user-1',
    memberName: 'Catherine Nakitto',
    memberInitials: 'CN',
    isSelf: true,
    facilityId: 'fac-1',
    facilityName: 'City Medical Centre',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2026-02-15', // Future - tests "On: 15 Feb 2026" formatting
    visitTime: '11:00 AM',
    status: 'pending_confirmation',
    createdAt: '2026-01-02T14:00:00Z',
    updatedAt: '2026-01-02T14:00:00Z',
  },
  {
    id: 'visit-5',
    memberId: 'dep-3',
    memberName: 'Michael Okello',
    memberInitials: 'MO',
    isSelf: false,
    facilityId: 'fac-2',
    facilityName: 'Mukono Family Clinic',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2026-01-20',
    visitTime: '3:45 PM',
    status: 'pending_confirmation',
    createdAt: '2026-01-02T16:00:00Z',
    updatedAt: '2026-01-02T16:00:00Z',
  },

  // COMPLETED VISITS - January 2026 (current month)
  {
    id: 'visit-6',
    memberId: 'user-1',
    memberName: 'Catherine Nakitto',
    memberInitials: 'CN',
    isSelf: true,
    facilityId: 'fac-2',
    facilityName: 'Mukono Family Clinic',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2026-01-01',
    visitTime: '10:34 AM',
    status: 'completed',
    copayAmount: 5000,
    createdAt: '2025-12-28T10:00:00Z',
    updatedAt: '2026-01-01T10:34:00Z',
  },

  // COMPLETED VISITS - December 2025 (tests month grouping)
  {
    id: 'visit-7',
    memberId: 'dep-1',
    memberName: 'Ben Were',
    memberInitials: 'BW',
    isSelf: false,
    facilityId: 'fac-1',
    facilityName: 'City Medical Centre',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2025-12-28',
    visitTime: '2:15 PM',
    status: 'completed',
    copayAmount: 5000,
    createdAt: '2025-12-20T09:00:00Z',
    updatedAt: '2025-12-28T14:15:00Z',
  },
  {
    id: 'visit-8',
    memberId: 'dep-2',
    memberName: 'Sarah Namugga',
    memberInitials: 'SN',
    isSelf: false,
    facilityId: 'fac-3',
    facilityName: 'Kampala International Medical Center and Specialist Hospital',
    packageId: 'pkg-2',
    packageCategory: 'Lab Tests',
    packageName: '10 tests pack',
    visitDate: '2025-12-15',
    visitTime: '9:00 AM',
    status: 'remotely_approved',
    copayAmount: 3000,
    createdAt: '2025-12-10T08:00:00Z',
    updatedAt: '2025-12-15T09:30:00Z',
  },
  {
    id: 'visit-9',
    memberId: 'user-1',
    memberName: 'Catherine Nakitto',
    memberInitials: 'CN',
    isSelf: true,
    facilityId: 'fac-1',
    facilityName: 'City Medical Centre',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2025-12-05',
    visitTime: '4:30 PM',
    status: 'completed',
    copayAmount: 5000,
    createdAt: '2025-11-28T10:00:00Z',
    updatedAt: '2025-12-05T16:30:00Z',
  },

  // COMPLETED VISITS - November 2025 (tests different month grouping)
  {
    id: 'visit-10',
    memberId: 'dep-3',
    memberName: 'Michael Okello',
    memberInitials: 'MO',
    isSelf: false,
    facilityId: 'fac-2',
    facilityName: 'Mukono Family Clinic',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2025-11-20',
    visitTime: '11:15 AM',
    status: 'completed',
    copayAmount: 5000,
    createdAt: '2025-11-15T09:00:00Z',
    updatedAt: '2025-11-20T11:15:00Z',
  },
  {
    id: 'visit-11',
    memberId: 'dep-1',
    memberName: 'Ben Were',
    memberInitials: 'BW',
    isSelf: false,
    facilityId: 'fac-1',
    facilityName: 'City Medical Centre',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2025-11-08',
    visitTime: '1:00 PM',
    status: 'remotely_approved',
    copayAmount: 5000,
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-08T13:00:00Z',
  },

  // CANCELED VISITS
  {
    id: 'visit-12',
    memberId: 'dep-2',
    memberName: 'Sarah Namugga',
    memberInitials: 'SN',
    isSelf: false,
    facilityId: 'fac-2',
    facilityName: 'Mukono Family Clinic',
    packageId: 'pkg-2',
    packageCategory: 'Lab Tests',
    packageName: '10 tests pack',
    visitDate: '2025-12-20',
    visitTime: '3:00 PM',
    status: 'canceled',
    refundNote: 'Visit refunded - Family emergency',
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2025-12-19T12:00:00Z',
  },
  {
    id: 'visit-13',
    memberId: 'user-1',
    memberName: 'Catherine Nakitto',
    memberInitials: 'CN',
    isSelf: true,
    facilityId: 'fac-3',
    facilityName: 'Kampala International Medical Center and Specialist Hospital',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2025-11-25',
    visitTime: '10:00 AM',
    status: 'canceled',
    refundNote: 'Visit refunded',
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-24T15:00:00Z',
  },

  // NO-SHOW VISITS
  {
    id: 'visit-14',
    memberId: 'dep-3',
    memberName: 'Michael Okello',
    memberInitials: 'MO',
    isSelf: false,
    facilityId: 'fac-1',
    facilityName: 'City Medical Centre',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2025-10-15',
    visitTime: '10:00 AM',
    status: 'no_show',
    refundNote: 'Visit forfeited - No show',
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-15T12:00:00Z',
  },
  {
    id: 'visit-15',
    memberId: 'dep-1',
    memberName: 'Ben Were',
    memberInitials: 'BW',
    isSelf: false,
    facilityId: 'fac-2',
    facilityName: 'Mukono Family Clinic',
    packageId: 'pkg-1',
    packageCategory: 'Consultations',
    packageName: '5 visits pack',
    visitDate: '2025-09-12',
    visitTime: '2:30 PM',
    status: 'no_show',
    refundNote: 'Visit forfeited',
    createdAt: '2025-09-05T10:00:00Z',
    updatedAt: '2025-09-12T15:00:00Z',
  },
];
