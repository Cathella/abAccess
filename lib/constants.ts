// App Constants

export const APP_NAME = "ABA Access";
export const APP_VERSION = "1.0.0";

// API Constants
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const PIN_LENGTH = 6;
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
