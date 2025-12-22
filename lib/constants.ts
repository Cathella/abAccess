// App Constants

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
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  PACKAGES: "/packages",
  MY_PACKAGES: "/my-packages",
  VISITS: "/visits",
  WALLET: "/wallet",
  PROFILE: "/profile",
  FAMILY: "/family",
  NOTIFICATIONS: "/notifications",
} as const;
