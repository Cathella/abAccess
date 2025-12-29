# Wallet Data Seeding Guide

This guide explains how to seed test data into the wallet for UI testing.

## What Gets Seeded

When you seed the wallet, the following test data is added:

### 💰 Balance
- **UGX 255,000** (calculated from transactions)

### 📝 Transactions (8 total)
1. **Top-up** - UGX 50,000 (MTN MoMo) - 5 days ago
2. **Top-up** - UGX 100,000 (Visa Card) - 3 days ago
3. **Purchase** - UGX 25,000 (Family Health Package) - 2 days ago
4. **Top-up** - UGX 75,000 (Visa Card + fee) - 1 day ago
5. **Purchase** - UGX 15,000 (Basic Checkup) - 12 hours ago
6. **Top-up** - UGX 30,000 (Airtel Money) - 6 hours ago
7. **Purchase** - UGX 45,000 (Dental Care Package) - 2 hours ago
8. **Top-up** - UGX 120,000 (MTN MoMo) - 30 minutes ago

### 💳 Saved Payment Methods (3 total)
1. **MTN MoMo** - +256782087786 (Default)
2. **Airtel Money** - +256700123456
3. **Visa Card** - •••• 4242

---

## Method 1: Using the Dev Tools Page (Recommended)

### Steps:
1. Navigate to `/dev-tools` in your browser
   ```
   http://localhost:3000/dev-tools
   ```

2. Click the **"🌱 Seed Wallet Data"** button

3. The page will automatically reload with the seeded data

4. Navigate to the wallet or dashboard to see the test data

### Features:
- ✅ Visual interface
- ✅ View current data
- ✅ Clear data easily
- ✅ Auto-reload after seeding

---

## Method 2: Using Browser Console

### Steps:
1. Open your browser's developer console
   - **Mac**: `Cmd + Option + I`
   - **Windows/Linux**: `F12` or `Ctrl + Shift + I`

2. Copy the entire contents of `/scripts/seedWallet.js`

3. Paste it into the console and press Enter

4. Run the seed command:
   ```javascript
   seedWallet()
   ```

5. Reload the page to see changes

### Available Console Commands:

```javascript
// Seed the wallet with test data
seedWallet()

// Clear all wallet data
clearWallet()

// View current wallet data
viewWallet()
```

---

## Method 3: Using Code Import

### Steps:
1. Import the seed utilities in any component:
   ```typescript
   import { seedWalletData, clearWalletData, getWalletData } from '@/lib/utils/seedWallet'
   ```

2. Call the function:
   ```typescript
   seedWalletData()  // Seeds the wallet
   clearWalletData() // Clears the wallet
   getWalletData()   // Gets current data
   ```

3. Reload the page to see changes

---

## Testing Scenarios

### Test Wallet Balance Display
- Navigate to `/dashboard`
- Should show **UGX 255,000** balance
- Should show wallet card with transaction history link

### Test Transaction History
- Navigate to `/wallet/history`
- Should show 8 transactions (oldest to newest)
- Should show filter options (All, Top-up, Purchase)
- Click any transaction to see details

### Test Saved Payment Methods
- Start a new top-up flow
- Navigate to payment method selection
- Should see 3 saved payment methods
- Should see "Add new" options for each type

### Test Transaction Details
- Navigate to any transaction in history
- Should show full details:
  - Transaction ID
  - Date and time
  - Payment method
  - Amount and fees
  - Status

---

## Clearing Test Data

### Option 1: Dev Tools Page
1. Go to `/dev-tools`
2. Click **"🗑️ Clear Wallet Data"**
3. Page will reload with empty wallet

### Option 2: Browser Console
```javascript
clearWallet()
// Then reload the page
```

### Option 3: Manual
1. Open browser DevTools
2. Go to **Application** tab
3. Select **Local Storage** → your domain
4. Find and delete `wallet-storage` key
5. Reload the page

---

## Data Structure

The seeded data follows this structure:

```typescript
{
  state: {
    balance: 255000,
    transactions: [...],        // 8 transactions
    savedPaymentMethods: [...], // 3 payment methods
    topUpData: {},
    isLoading: false,
    isProcessing: false,
    transactionFilter: 'all'
  },
  version: 0
}
```

---

## Notes

- ⚠️ **Data is stored in localStorage** - it will persist until you clear it or clear browser data
- 🔄 **Always reload the page** after seeding/clearing to see changes
- 🧪 **Safe for testing** - only affects local storage, no database changes
- 🎨 **Customize transactions** - edit `/lib/utils/seedWallet.ts` to modify seed data

---

## Troubleshooting

### Data not showing after seeding?
- ✅ Make sure you reloaded the page
- ✅ Check browser console for errors
- ✅ Verify localStorage has `wallet-storage` key

### Balance not matching?
- ✅ Balance is calculated automatically from transactions
- ✅ Formula: `Total Top-ups - Total Purchases = Balance`

### Can't access /dev-tools?
- ✅ Make sure the route exists in your app
- ✅ Check that you're authenticated
- ✅ Verify the page file exists at `/app/(main)/dev-tools/page.tsx`

---

## Quick Start

**Fastest way to test:**

1. Open console (`Cmd+Option+I` / `F12`)
2. Paste `/scripts/seedWallet.js` contents
3. Run `seedWallet()`
4. Reload page
5. Navigate to `/wallet/history` or `/dashboard`

Done! 🎉
