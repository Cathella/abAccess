// User Types
export interface User {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

// Package Types
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  duration: number; // in days
  status: "active" | "inactive" | "expired";
  createdAt: string;
  updatedAt: string;
}

export interface UserPackage {
  id: string;
  userId: string;
  packageId: string;
  package: Package;
  purchaseDate: string;
  expiryDate: string;
  status: "active" | "expired" | "cancelled";
  remainingVisits?: number;
}

// Visit Types
export interface Visit {
  id: string;
  userId: string;
  packageId: string;
  facilityId: string;
  facility: Facility;
  date: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Facility Types
export interface Facility {
  id: string;
  name: string;
  location: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
}

// Family Member Types
export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  createdAt: string;
  updatedAt: string;
}

// Wallet Types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  status: "pending" | "completed" | "failed";
  reference?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}
