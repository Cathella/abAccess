// Enums
export enum Relationship {
  CHILD = "child",
  SPOUSE = "spouse",
  PARENT = "parent",
  SIBLING = "sibling",
  OTHER = "other",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum PackageStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  EXHAUSTED = "exhausted",
}

export enum PackageCategory {
  CONSULTATIONS = "consultations",
  CHILD_WELLNESS = "childWellness",
  MATERNITY = "maternity",
  LAB_TESTS = "labTests",
  DENTAL = "dental",
  OPTICAL = "optical",
}

// Package type aliases
export type PackageStatusType = 'active' | 'completed' | 'expired';

export type PackageCategoryType = 'consultations' | 'lab_tests' | 'pharmacy' | 'dental' | 'optical' | 'maternity';

export enum VisitStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "noShow",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DECLINED = "declined",
  CANCELLED = "cancelled",
}

export enum TransactionType {
  TOP_UP = "topUp",
  PURCHASE = "purchase",
  REFUND = "refund",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum PaymentProvider {
  MTN_MOMO = "mtnMomo",
  AIRTEL_MONEY = "airtelMoney",
  CARD = "card",
}

export enum NotificationType {
  APPROVAL = "approval",
  BOOKING = "booking",
  REMINDER = "reminder",
  PACKAGE = "package",
  WALLET = "wallet",
  SYSTEM = "system",
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
  EXPIRED = "expired",
}

// User Types
export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  pinHash: string; // Hashed PIN, never plain
  memberId?: string; // Unique member identifier (A-XXXXXX)
  nin?: string; // National ID Number
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Result Types
export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface Dependent {
  id: string;
  userId: string;
  name: string;
  relationship: Relationship;
  dateOfBirth: string; // ISO date string
  gender: 'male' | 'female';
  photo?: string;
  birthCertificateNumber?: string;
  createdAt: string;
}

export interface DependentVisit {
  id: string;
  dependentId: string;
  facilityName: string;
  facilityIcon?: string;
  date: string;
  packageName: string;
}

// Package Types
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  visitCount: number;
  validityDays: number;
  copay: number;
  category: PackageCategory;
  facilities: string[];
  features: string[];
  isActive: boolean;
}

export interface UserPackage {
  id: string;
  userId: string;
  packageId: string;
  package?: Package;
  purchaseDate: string;
  expiryDate: string;
  visitsRemaining: number;
  visitsUsed: number;
  status: PackageStatus;
}

// New Package Management Types
export interface PackageType {
  id: string;
  name: string; // "Consultations", "Lab Tests", "Pharmacy"
  category: PackageCategoryType;
  description: string;
  price: number;
  visits: number; // Total visits in package
  validityDays: number; // e.g., 30 days
  copay: number; // Amount paid at facility per visit
  facilities: number; // Number of partner facilities
}

export interface UserPackageType {
  id: string;
  userId: string;
  packageId: string;
  package: PackageType;
  purchaseDate: string;
  expiryDate: string;
  completedDate?: string; // When all visits used
  totalVisits: number;
  usedVisits: number;
  remainingVisits: number;
  status: PackageStatusType;
  usageHistory: PackageUsage[];
}

export interface PackageUsage {
  id: string;
  userPackageId: string;
  personName: string; // User or dependent name
  personInitials: string;
  facilityName: string;
  visitDate: string;
  copayPaid: number;
}

// Helper type for display
export interface PackageDisplayInfo {
  isExpiringSoon: boolean; // < 7 days to expiry
  isLowVisits: boolean; // 1 visit remaining
  daysUntilExpiry: number;
  totalCopayPaid: number;
}

// Visit Types
export interface Visit {
  id: string;
  userPackageId: string;
  dependentId?: string;
  facilityId: string;
  visitDate: string;
  status: VisitStatus;
  copayPaid: boolean;
  qrCode: string;
  providerNotes?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  visitId: string;
  requestedDate: string;
  requestedTime: string;
  confirmedDate?: string;
  confirmedTime?: string;
  status: BookingStatus;
}

// Facility Types
export interface OperatingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  rating: number;
  ratingCount: number;
  services: string[];
  operatingHours: OperatingHours[];
  acceptsBooking: boolean;
  isPartner: boolean;
}

// Family Member Types
export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: Relationship;
  dateOfBirth: string;
  gender: Gender;
  createdAt: string;
  updatedAt: string;
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference?: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentProvider;
  provider: string;
  accountNumber: string;
  isDefault: boolean;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Approval Types
export interface ApprovalRequest {
  id: string;
  userPackageId: string;
  dependentId: string;
  facilityId: string;
  status: ApprovalStatus;
  requestedAt: string;
  respondedAt?: string;
  expiresAt: string;
}

// Wallet Feature Types
export type PaymentMethodType = 'mtn_momo' | 'airtel_money' | 'card';

export type WalletTransactionType = 'top_up' | 'purchase';

export type WalletTransactionStatus = 'pending' | 'completed' | 'failed';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  fee: number;
  status: WalletTransactionStatus;
  paymentMethod: PaymentMethodType;
  phoneNumber?: string; // For mobile money
  cardLast4?: string; // For card payments
  packageName?: string; // For purchases
  packageVisits?: number; // For purchases
  transactionId: string; // e.g., TXN-2025-00891
  createdAt: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  phoneNumber?: string; // For mobile money
  cardLast4?: string; // For card
  cardBrand?: string; // Visa, Mastercard
  isDefault: boolean;
}

export interface TopUpData {
  amount: number;
  paymentMethod: PaymentMethodType;
  phoneNumber?: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  saveForFuture: boolean;
}

// Browse Packages Feature Types

// Package Categories for browsing
export type BrowsePackageCategory =
  | 'consultations'
  | 'lab_tests'
  | 'maternal_care'
  | 'child_wellness'
  | 'pharmacy';

export interface CategoryInfo {
  id: BrowsePackageCategory;
  name: string;
  description: string;
  emoji: string;
}

// Available Package (for browsing)
export interface AvailablePackage {
  id: string;
  categoryId: BrowsePackageCategory;
  name: string;              // e.g., "5 Visits Pack"
  price: number;             // e.g., 65000
  visits: number;            // e.g., 5
  copay: number;             // e.g., 5000
  validityDays: number;      // e.g., 30
  totalValue: number;        // e.g., 90000
  savingsPercent: number;    // e.g., 17
  partnerCount: number;      // e.g., 24
  isBestValue?: boolean;
  inclusions: string[];      // e.g., ["5 GP consultations", "Valid at 24 partner clinics"]
}

// Purchase flow types
export type RecipientType = 'myself' | 'child' | 'family';

export interface PurchaseData {
  package: AvailablePackage | null;
  recipient: RecipientType;
  paymentMethod: 'wallet' | 'mobile_money';
  termsAccepted: boolean;
}

export type PurchaseStatus = 'idle' | 'processing' | 'success' | 'failed' | 'network_error';
