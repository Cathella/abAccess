import type { UserPackageType, PackageType } from '@/types'

// Helper to generate dates
const getDateDaysAgo = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

const getDateDaysFromNow = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// Mock Packages
export const mockPackages: PackageType[] = [
  {
    id: 'pkg_consultations_5',
    name: 'Consultations',
    category: 'consultations',
    description: 'General health consultations with medical professionals',
    price: 50000,
    visits: 5,
    validityDays: 30,
    copay: 5000,
    facilities: 24,
  },
  {
    id: 'pkg_lab_tests_10',
    name: 'Lab Tests',
    category: 'lab_tests',
    description: 'Laboratory tests and diagnostics',
    price: 75000,
    visits: 10,
    validityDays: 60,
    copay: 3000,
    facilities: 18,
  },
  {
    id: 'pkg_pharmacy_8',
    name: 'Pharmacy',
    category: 'pharmacy',
    description: 'Prescription medications and pharmacy services',
    price: 60000,
    visits: 8,
    validityDays: 45,
    copay: 4000,
    facilities: 32,
  },
]

// Mock User Packages
export const mockUserPackages: UserPackageType[] = [
  // Active Package - Consultations
  {
    id: '1',
    userId: 'user_1',
    packageId: 'pkg_consultations_5',
    package: {
      id: 'pkg_consultations_5',
      name: 'Consultations',
      category: 'consultations',
      description: 'General health consultations with medical professionals',
      price: 50000,
      visits: 5,
      validityDays: 30,
      copay: 5000,
      facilities: 24,
    },
    purchaseDate: getDateDaysAgo(25),
    expiryDate: getDateDaysFromNow(5), // Expiring soon
    totalVisits: 5,
    usedVisits: 2,
    remainingVisits: 3,
    status: 'active',
    usageHistory: [
      {
        id: 'u1',
        userPackageId: '1',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Mukono Family Clinic',
        visitDate: getDateDaysAgo(20),
        copayPaid: 5000,
      },
      {
        id: 'u2',
        userPackageId: '1',
        personName: 'John Doe',
        personInitials: 'JD',
        facilityName: 'Kampala Medical Center',
        visitDate: getDateDaysAgo(12),
        copayPaid: 5000,
      },
    ],
  },
  // Active Package - Lab Tests (low visits)
  {
    id: '2',
    userId: 'user_1',
    packageId: 'pkg_lab_tests_10',
    package: {
      id: 'pkg_lab_tests_10',
      name: 'Lab Tests',
      category: 'lab_tests',
      description: 'Laboratory tests and diagnostics',
      price: 75000,
      visits: 10,
      validityDays: 60,
      copay: 3000,
      facilities: 18,
    },
    purchaseDate: getDateDaysAgo(30),
    expiryDate: getDateDaysFromNow(30),
    totalVisits: 10,
    usedVisits: 9,
    remainingVisits: 1, // Low visits
    status: 'active',
    usageHistory: [
      {
        id: 'u3',
        userPackageId: '2',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Mulago Hospital',
        visitDate: getDateDaysAgo(28),
        copayPaid: 3000,
      },
      {
        id: 'u4',
        userPackageId: '2',
        personName: 'Sarah Smith',
        personInitials: 'SS',
        facilityName: 'Nakasero Hospital',
        visitDate: getDateDaysAgo(25),
        copayPaid: 3000,
      },
      {
        id: 'u5',
        userPackageId: '2',
        personName: 'John Doe',
        personInitials: 'JD',
        facilityName: 'Kampala Medical Center',
        visitDate: getDateDaysAgo(22),
        copayPaid: 3000,
      },
      {
        id: 'u6',
        userPackageId: '2',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Mukono Family Clinic',
        visitDate: getDateDaysAgo(18),
        copayPaid: 3000,
      },
      {
        id: 'u7',
        userPackageId: '2',
        personName: 'Peter Johnson',
        personInitials: 'PJ',
        facilityName: 'Mulago Hospital',
        visitDate: getDateDaysAgo(15),
        copayPaid: 3000,
      },
      {
        id: 'u8',
        userPackageId: '2',
        personName: 'Sarah Smith',
        personInitials: 'SS',
        facilityName: 'Nakasero Hospital',
        visitDate: getDateDaysAgo(12),
        copayPaid: 3000,
      },
      {
        id: 'u9',
        userPackageId: '2',
        personName: 'John Doe',
        personInitials: 'JD',
        facilityName: 'Kampala Medical Center',
        visitDate: getDateDaysAgo(9),
        copayPaid: 3000,
      },
      {
        id: 'u10',
        userPackageId: '2',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Mukono Family Clinic',
        visitDate: getDateDaysAgo(6),
        copayPaid: 3000,
      },
      {
        id: 'u11',
        userPackageId: '2',
        personName: 'Peter Johnson',
        personInitials: 'PJ',
        facilityName: 'Mulago Hospital',
        visitDate: getDateDaysAgo(3),
        copayPaid: 3000,
      },
    ],
  },
  // Completed Package
  {
    id: '3',
    userId: 'user_1',
    packageId: 'pkg_pharmacy_8',
    package: {
      id: 'pkg_pharmacy_8',
      name: 'Pharmacy',
      category: 'pharmacy',
      description: 'Prescription medications and pharmacy services',
      price: 60000,
      visits: 8,
      validityDays: 45,
      copay: 4000,
      facilities: 32,
    },
    purchaseDate: getDateDaysAgo(40),
    expiryDate: getDateDaysFromNow(5),
    completedDate: getDateDaysAgo(2),
    totalVisits: 8,
    usedVisits: 8,
    remainingVisits: 0,
    status: 'completed',
    usageHistory: [
      {
        id: 'u12',
        userPackageId: '3',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Kampala Pharmacy',
        visitDate: getDateDaysAgo(38),
        copayPaid: 4000,
      },
      {
        id: 'u13',
        userPackageId: '3',
        personName: 'John Doe',
        personInitials: 'JD',
        facilityName: 'Health Plus Pharmacy',
        visitDate: getDateDaysAgo(35),
        copayPaid: 4000,
      },
      {
        id: 'u14',
        userPackageId: '3',
        personName: 'Sarah Smith',
        personInitials: 'SS',
        facilityName: 'Kampala Pharmacy',
        visitDate: getDateDaysAgo(30),
        copayPaid: 4000,
      },
      {
        id: 'u15',
        userPackageId: '3',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Health Plus Pharmacy',
        visitDate: getDateDaysAgo(25),
        copayPaid: 4000,
      },
      {
        id: 'u16',
        userPackageId: '3',
        personName: 'Peter Johnson',
        personInitials: 'PJ',
        facilityName: 'Kampala Pharmacy',
        visitDate: getDateDaysAgo(18),
        copayPaid: 4000,
      },
      {
        id: 'u17',
        userPackageId: '3',
        personName: 'John Doe',
        personInitials: 'JD',
        facilityName: 'Health Plus Pharmacy',
        visitDate: getDateDaysAgo(12),
        copayPaid: 4000,
      },
      {
        id: 'u18',
        userPackageId: '3',
        personName: 'Sarah Smith',
        personInitials: 'SS',
        facilityName: 'Kampala Pharmacy',
        visitDate: getDateDaysAgo(7),
        copayPaid: 4000,
      },
      {
        id: 'u19',
        userPackageId: '3',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Health Plus Pharmacy',
        visitDate: getDateDaysAgo(2),
        copayPaid: 4000,
      },
    ],
  },
  // Expired Package
  {
    id: '4',
    userId: 'user_1',
    packageId: 'pkg_consultations_5',
    package: {
      id: 'pkg_consultations_5',
      name: 'Consultations',
      category: 'consultations',
      description: 'General health consultations with medical professionals',
      price: 50000,
      visits: 5,
      validityDays: 30,
      copay: 5000,
      facilities: 24,
    },
    purchaseDate: getDateDaysAgo(65),
    expiryDate: getDateDaysAgo(35), // Expired 35 days ago
    totalVisits: 5,
    usedVisits: 2,
    remainingVisits: 3, // 3 visits forfeited
    status: 'expired',
    usageHistory: [
      {
        id: 'u20',
        userPackageId: '4',
        personName: 'Nakitto Catherine',
        personInitials: 'NC',
        facilityName: 'Mukono Family Clinic',
        visitDate: getDateDaysAgo(60),
        copayPaid: 5000,
      },
      {
        id: 'u21',
        userPackageId: '4',
        personName: 'John Doe',
        personInitials: 'JD',
        facilityName: 'Kampala Medical Center',
        visitDate: getDateDaysAgo(50),
        copayPaid: 5000,
      },
    ],
  },
]

// Function to load mock data into the store
export function loadMockData(): UserPackageType[] {
  return mockUserPackages
}
