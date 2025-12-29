/**
 * Browser Console Script to Seed Wallet Data
 *
 * Usage:
 * 1. Open browser console (F12 or Cmd+Option+I)
 * 2. Copy and paste this entire script
 * 3. Run: seedWallet()
 * 4. Reload the page to see changes
 *
 * Commands:
 * - seedWallet()     - Add test transactions and balance
 * - clearWallet()    - Clear all wallet data
 * - viewWallet()     - View current wallet data
 */

window.seedWallet = function() {
  // Generate sample transactions
  const transactions = [
    {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: 50000,
      fee: 0,
      status: 'completed',
      paymentMethod: 'mtn_momo',
      phoneNumber: '+256782087786',
      transactionId: 'TXN' + Date.now() + '001',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'top_up',
      amount: 75000,
      fee: 1875,
      status: 'completed',
      paymentMethod: 'card',
      cardLast4: '4242',
      transactionId: 'TXN' + Date.now() + '004',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
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
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
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
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ];

  // Generate sample saved payment methods
  const savedPaymentMethods = [
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
  ];

  // Calculate balance
  const totalTopUps = transactions
    .filter((t) => t.type === 'top_up')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPurchases = transactions
    .filter((t) => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalTopUps - totalPurchases;

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
  };

  // Save to localStorage
  localStorage.setItem('wallet-storage', JSON.stringify(walletStorage));

  console.log('%c✅ Wallet data seeded successfully!', 'color: green; font-weight: bold; font-size: 16px;');
  console.log(`%c💰 Balance: UGX ${balance.toLocaleString()}`, 'color: blue; font-size: 14px;');
  console.log(`%c📝 Transactions: ${transactions.length}`, 'color: blue; font-size: 14px;');
  console.log(`%c💳 Saved payment methods: ${savedPaymentMethods.length}`, 'color: blue; font-size: 14px;');
  console.log('%c🔄 Reload the page to see changes', 'color: orange; font-weight: bold;');

  return { balance, transactions, savedPaymentMethods };
};

window.clearWallet = function() {
  localStorage.removeItem('wallet-storage');
  console.log('%c🗑️ Wallet data cleared!', 'color: red; font-weight: bold; font-size: 16px;');
  console.log('%c🔄 Reload the page to see changes', 'color: orange; font-weight: bold;');
};

window.viewWallet = function() {
  const data = localStorage.getItem('wallet-storage');
  if (!data) {
    console.log('%c⚠️ No wallet data found', 'color: orange; font-weight: bold;');
    return null;
  }
  const parsed = JSON.parse(data);
  console.log('%c📊 Current Wallet Data:', 'color: blue; font-weight: bold; font-size: 16px;');
  console.table({
    Balance: `UGX ${parsed.state.balance.toLocaleString()}`,
    Transactions: parsed.state.transactions.length,
    'Saved Methods': parsed.state.savedPaymentMethods.length,
  });
  console.log('Full data:', parsed);
  return parsed;
};

// Instructions
console.log('%c🚀 Wallet Seed Script Loaded!', 'color: green; font-weight: bold; font-size: 18px;');
console.log('%cAvailable commands:', 'font-weight: bold; font-size: 14px;');
console.log('%c  seedWallet()  %c - Add test transactions and balance', 'color: blue; font-weight: bold;', 'color: black;');
console.log('%c  clearWallet() %c - Clear all wallet data', 'color: red; font-weight: bold;', 'color: black;');
console.log('%c  viewWallet()  %c - View current wallet data', 'color: purple; font-weight: bold;', 'color: black;');
