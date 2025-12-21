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
  name: string;
  pin: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dependent {
  id: string;
  userId: string;
  name: string;
  relationship: Relationship;
  dateOfBirth: string;
  gender: Gender;
  photo?: string;
  birthCertificateNumber?: string;
  createdAt: string;
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
