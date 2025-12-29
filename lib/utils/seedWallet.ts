/**
 * Seed wallet data for testing
 * This file provides utilities to seed the wallet with test data
 */

import type { WalletTransaction, SavedPaymentMethod } from '@/types'

export const seedWalletData = () => {
  // Generate sample transactions
  const transactions: WalletTransaction[] = [
    {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: 50000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'mtn_momo',
      phoneNumber: '+256782087786',
      transactionId: 'TXN' + Date.now() + '001',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: 100000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'card',
      cardLast4: '4242',
      transactionId: 'TXN' + Date.now() + '002',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: crypto.randomUUID(),
      type: 'purchase',
      amount: 25000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'mtn_momo',
      packageName: 'Family Health Package',
      transactionId: 'TXN' + Date.now() + '003',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: 75000,
      fee: 1875, // 2.5% card fee
      status: 'completed',
      paymentMethod: 'card',
      cardLast4: '4242',
      transactionId: 'TXN' + Date.now() + '004',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: crypto.randomUUID(),
      type: 'purchase',
      amount: 15000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'airtel_money',
      packageName: 'Basic Checkup',
      transactionId: 'TXN' + Date.now() + '005',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: 30000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'airtel_money',
      phoneNumber: '+256700123456',
      transactionId: 'TXN' + Date.now() + '006',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      id: crypto.randomUUID(),
      type: 'purchase',
      amount: 45000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'mtn_momo',
      packageName: 'Dental Care Package',
      transactionId: 'TXN' + Date.now() + '007',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: 120000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'mtn_momo',
      phoneNumber: '+256782087786',
      transactionId: 'TXN' + Date.now() + '008',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
  ]

  // Generate sample saved payment methods
  const savedPaymentMethods: SavedPaymentMethod[] = [
    {
      id: crypto.randomUUID(),
      type: 'mtn_momo',
      phoneNumber: '+256782087786',
      isDefault: true,
    },
    {
      id: crypto.randomUUID(),
      type: 'airtel_money',
      phoneNumber: '+256700123456',
      isDefault: false,
    },
    {
      id: crypto.randomUUID(),
      type: 'card',
      cardLast4: '4242',
      cardBrand: 'Visa',
      isDefault: false,
    },
  ]

  // Calculate balance (total top-ups minus total purchases)
  const totalTopUps = transactions
    .filter((t) => t.type === 'top_up')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalPurchases = transactions
    .filter((t) => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = totalTopUps - totalPurchases

  // Create wallet storage object
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

  // Save to localStorage
  localStorage.setItem('wallet-storage', JSON.stringify(walletStorage))

  console.log('✅ Wallet data seeded successfully!')
  console.log(`💰 Balance: UGX ${balance.toLocaleString()}`)
  console.log(`📝 Transactions: ${transactions.length}`)
  console.log(`💳 Saved payment methods: ${savedPaymentMethods.length}`)

  return {
    balance,
    transactions,
    savedPaymentMethods,
  }
}

/**
 * Clear all wallet data
 */
export const clearWalletData = () => {
  localStorage.removeItem('wallet-storage')
  console.log('🗑️ Wallet data cleared')
}

/**
 * Get current wallet data
 */
export const getWalletData = () => {
  const data = localStorage.getItem('wallet-storage')
  if (!data) {
    console.log('No wallet data found')
    return null
  }
  return JSON.parse(data)
}
