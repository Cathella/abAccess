/**
 * Comprehensive test data seeding
 * Seeds all stores with realistic test data
 */

import type { Dependent } from '@/types'
import { MOCK_VISITS } from '@/lib/constants'

/**
 * Mock Dependents Data
 * These IDs match the MOCK_VISITS data in lib/constants.ts for consistent testing
 */
export const mockDependents: Dependent[] = [
  {
    id: 'dep-1',
    userId: 'user_1',
    name: 'Ben Were',
    relationship: 'child',
    dateOfBirth: '2018-03-15', // 6 years old
    gender: 'male',
    photo: undefined,
    birthCertificateNumber: 'BC-2018-0315',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
  },
  {
    id: 'dep-2',
    userId: 'user_1',
    name: 'Sarah Namugga',
    relationship: 'child',
    dateOfBirth: '2020-07-22', // 4 years old
    gender: 'female',
    photo: undefined,
    birthCertificateNumber: 'BC-2020-0722',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
  },
  {
    id: 'dep-3',
    userId: 'user_1',
    name: 'Michael Okello',
    relationship: 'child',
    dateOfBirth: '2022-05-10', // 2 years old
    gender: 'male',
    photo: undefined,
    birthCertificateNumber: 'BC-2022-0510',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 months ago
  },
]

/**
 * Seed Family Store with dependents
 */
export const seedFamilyStore = () => {
  const familyStorage = {
    state: {
      dependents: mockDependents,
    },
    version: 0,
  }

  localStorage.setItem('family-storage', JSON.stringify(familyStorage))

  console.log('✅ Family data seeded successfully!')
  console.log(`👨‍👩‍👧‍👦 Dependents: ${mockDependents.length}`)

  return mockDependents
}

/**
 * Seed Wallet Store with balance and transactions
 */
export const seedWalletStore = () => {
  const transactions = [
    {
      id: `txn-${Date.now()}-1`,
      type: 'top_up' as const,
      amount: 200000,
      fee: 0,
      status: 'completed' as const,
      paymentMethod: 'mtn_momo' as const,
      phoneNumber: '+256782087786',
      transactionId: `TXN-2025-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    {
      id: `txn-${Date.now()}-2`,
      type: 'purchase' as const,
      amount: 65000,
      fee: 0,
      status: 'completed' as const,
      paymentMethod: 'mtn_momo' as const,
      packageName: '5 Visits Pack',
      packageVisits: 5,
      transactionId: `TXN-2025-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: `txn-${Date.now()}-3`,
      type: 'top_up' as const,
      amount: 100000,
      fee: 0,
      status: 'completed' as const,
      paymentMethod: 'airtel_money' as const,
      phoneNumber: '+256700123456',
      transactionId: `TXN-2025-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: `txn-${Date.now()}-4`,
      type: 'purchase' as const,
      amount: 45000,
      fee: 0,
      status: 'completed' as const,
      paymentMethod: 'mtn_momo' as const,
      packageName: '3 Visits Pack',
      packageVisits: 3,
      transactionId: `TXN-2025-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ]

  const savedPaymentMethods = [
    {
      id: 'pm-1',
      type: 'mtn_momo' as const,
      phoneNumber: '+256782087786',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'airtel_money' as const,
      phoneNumber: '+256700123456',
      isDefault: false,
    },
  ]

  // Calculate balance: 200,000 + 100,000 - 65,000 - 45,000 = 190,000
  const balance = 190000

  const walletStorage = {
    state: {
      balance,
      transactions,
      savedPaymentMethods,
      topUpData: {},
      isLoading: false,
      isProcessing: false,
      transactionFilter: 'all',
    },
    version: 0,
  }

  localStorage.setItem('wallet-storage', JSON.stringify(walletStorage))

  console.log('✅ Wallet data seeded successfully!')
  console.log(`💰 Balance: UGX ${balance.toLocaleString()}`)
  console.log(`📝 Transactions: ${transactions.length}`)

  return { balance, transactions, savedPaymentMethods }
}

/**
 * Seed Package Store with user's purchased packages
 */
export const seedPackageStore = () => {
  const now = new Date()

  const userPackages = [
    // Active package - Consultations (recently purchased)
    {
      id: 'user-pkg-1',
      userId: 'user_1',
      packageId: 'cons-5',
      package: {
        id: 'cons-5',
        name: '5 Visits Pack',
        category: 'consultations' as const,
        description: 'GP consultations at partner clinics',
        price: 65000,
        visits: 5,
        validityDays: 30,
        copay: 5000,
        facilities: 24,
      },
      purchaseDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      expiryDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
      totalVisits: 5,
      usedVisits: 2,
      remainingVisits: 3,
      status: 'active' as const,
      usageHistory: [
        {
          id: 'usage-1',
          userPackageId: 'user-pkg-1',
          personName: 'Catherine Nakitto',
          personInitials: 'CN',
          facilityName: 'Mukono Family Clinic',
          visitDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          copayPaid: 5000,
        },
        {
          id: 'usage-2',
          userPackageId: 'user-pkg-1',
          personName: 'Sarah Nakitto',
          personInitials: 'SN',
          facilityName: 'Kampala Medical Center',
          visitDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          copayPaid: 5000,
        },
      ],
    },
    // Active package - Lab Tests (older, expiring soon)
    {
      id: 'user-pkg-2',
      userId: 'user_1',
      packageId: 'lab-3',
      package: {
        id: 'lab-3',
        name: '3 Tests Pack',
        category: 'lab_tests' as const,
        description: 'Diagnostics at partner labs',
        price: 75000,
        visits: 3,
        validityDays: 30,
        copay: 10000,
        facilities: 12,
      },
      purchaseDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
      expiryDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 5 days
      totalVisits: 3,
      usedVisits: 2,
      remainingVisits: 1,
      status: 'active' as const,
      usageHistory: [
        {
          id: 'usage-3',
          userPackageId: 'user-pkg-2',
          personName: 'Catherine Nakitto',
          personInitials: 'CN',
          facilityName: 'Mulago Hospital Lab',
          visitDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          copayPaid: 10000,
        },
        {
          id: 'usage-4',
          userPackageId: 'user-pkg-2',
          personName: 'John Nakitto Jr.',
          personInitials: 'JN',
          facilityName: 'Nakasero Hospital Lab',
          visitDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          copayPaid: 10000,
        },
      ],
    },
    // Completed package
    {
      id: 'user-pkg-3',
      userId: 'user_1',
      packageId: 'cons-3',
      package: {
        id: 'cons-3',
        name: '3 Visits Pack',
        category: 'consultations' as const,
        description: 'GP consultations at partner clinics',
        price: 45000,
        visits: 3,
        validityDays: 30,
        copay: 5000,
        facilities: 24,
      },
      purchaseDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
      expiryDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Expired 10 days ago
      completedDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // Completed 15 days ago
      totalVisits: 3,
      usedVisits: 3,
      remainingVisits: 0,
      status: 'completed' as const,
      usageHistory: [
        {
          id: 'usage-5',
          userPackageId: 'user-pkg-3',
          personName: 'Catherine Nakitto',
          personInitials: 'CN',
          facilityName: 'Mukono Family Clinic',
          visitDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          copayPaid: 5000,
        },
        {
          id: 'usage-6',
          userPackageId: 'user-pkg-3',
          personName: 'Sarah Nakitto',
          personInitials: 'SN',
          facilityName: 'Kampala Medical Center',
          visitDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          copayPaid: 5000,
        },
        {
          id: 'usage-7',
          userPackageId: 'user-pkg-3',
          personName: 'Catherine Nakitto',
          personInitials: 'CN',
          facilityName: 'Nakasero Hospital',
          visitDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          copayPaid: 5000,
        },
      ],
    },
  ]

  const packageStorage = {
    state: {
      userPackages,
      availablePackages: [],
      selectedPackage: null,
      packageFilter: 'active',
      isLoading: false,
      hasInitialized: true,
    },
    version: 0,
  }

  localStorage.setItem('package-storage', JSON.stringify(packageStorage))

  console.log('✅ Package data seeded successfully!')
  console.log(`📦 User packages: ${userPackages.length}`)
  console.log(`   - Active: ${userPackages.filter(p => p.status === 'active').length}`)
  console.log(`   - Completed: ${userPackages.filter(p => p.status === 'completed').length}`)

  return userPackages
}

/**
 * Seed Visits Store with mock visit records
 */
export const seedVisitsStore = () => {
  const visitsStorage = {
    state: {
      visits: MOCK_VISITS,
      isLoading: false,
      activeTab: 'upcoming',
      selectedMemberId: 'all',
    },
    version: 0,
  }

  localStorage.setItem('visits-storage', JSON.stringify(visitsStorage))

  const upcomingVisits = MOCK_VISITS.filter(v =>
    ['pending_confirmation', 'confirmed'].includes(v.status)
  ).length
  const completedVisits = MOCK_VISITS.filter(v =>
    ['completed', 'remotely_approved'].includes(v.status)
  ).length
  const canceledVisits = MOCK_VISITS.filter(v =>
    ['canceled', 'no_show'].includes(v.status)
  ).length

  console.log('✅ Visits data seeded successfully!')
  console.log(`📅 Total visits: ${MOCK_VISITS.length}`)
  console.log(`   - Upcoming: ${upcomingVisits}`)
  console.log(`   - Completed: ${completedVisits}`)
  console.log(`   - Canceled: ${canceledVisits}`)

  return {
    total: MOCK_VISITS.length,
    upcoming: upcomingVisits,
    completed: completedVisits,
    canceled: canceledVisits,
  }
}

/**
 * Seed Auth Store with user data
 */
export const seedAuthStore = () => {
  const user = {
    id: 'user_1',
    phone: '+256782087786',
    firstName: 'Catherine',
    lastName: 'Nakitto',
    pinHash: '$2b$10$sBA4GeLZcbtUANGFBmWqG.UXiuK64/c1Pv3QjDi3OVgdXhfXogwBm', // Hashed "1234"
    memberId: 'A-123456',
    nin: undefined,
    avatar: undefined,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
    updatedAt: new Date().toISOString(),
  }

  const authStorage = {
    state: {
      user,
      phoneNumber: user.phone,
      isPinLocked: false,
      pinAttempts: 0,
      isLoading: false,
    },
    version: 0,
  }

  localStorage.setItem('auth-storage', JSON.stringify(authStorage))

  console.log('✅ Auth data seeded successfully!')
  console.log(`👤 User: ${user.firstName} ${user.lastName}`)
  console.log(`📱 Phone: ${user.phone}`)
  console.log(`🆔 Member ID: ${user.memberId}`)

  return user
}

/**
 * Clear all test data
 */
export const clearAllTestData = () => {
  localStorage.removeItem('auth-storage')
  localStorage.removeItem('wallet-storage')
  localStorage.removeItem('package-storage')
  localStorage.removeItem('family-storage')
  localStorage.removeItem('visits-storage')

  console.log('🗑️ All test data cleared')
}

/**
 * Seed all stores with test data
 */
export const seedAllTestData = () => {
  console.log('🌱 Seeding all test data...\n')

  const user = seedAuthStore()
  const wallet = seedWalletStore()
  const packages = seedPackageStore()
  const dependents = seedFamilyStore()
  const visits = seedVisitsStore()

  console.log('\n✅ All test data seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`   User: ${user.firstName} ${user.lastName} (${user.memberId})`)
  console.log(`   Wallet Balance: UGX ${wallet.balance.toLocaleString()}`)
  console.log(`   Active Packages: ${packages.filter(p => p.status === 'active').length}`)
  console.log(`   Dependents: ${dependents.length}`)
  console.log(`   Visits: ${visits.total} (${visits.upcoming} upcoming, ${visits.completed} completed)`)
  console.log('\n🔑 Test PIN: 1234')
  console.log('📱 Test Phone: +256782087786\n')

  return {
    user,
    wallet,
    packages,
    dependents,
    visits,
  }
}

/**
 * Get current test data status
 */
export const getTestDataStatus = () => {
  const hasAuth = !!localStorage.getItem('auth-storage')
  const hasWallet = !!localStorage.getItem('wallet-storage')
  const hasPackages = !!localStorage.getItem('package-storage')
  const hasFamily = !!localStorage.getItem('family-storage')
  const hasVisits = !!localStorage.getItem('visits-storage')

  console.log('📊 Test Data Status:')
  console.log(`   Auth: ${hasAuth ? '✅' : '❌'}`)
  console.log(`   Wallet: ${hasWallet ? '✅' : '❌'}`)
  console.log(`   Packages: ${hasPackages ? '✅' : '❌'}`)
  console.log(`   Family: ${hasFamily ? '✅' : '❌'}`)
  console.log(`   Visits: ${hasVisits ? '✅' : '❌'}`)

  return {
    hasAuth,
    hasWallet,
    hasPackages,
    hasFamily,
    hasVisits,
    isComplete: hasAuth && hasWallet && hasPackages && hasFamily && hasVisits,
  }
}
