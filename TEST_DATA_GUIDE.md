# Test Data Guide

Complete guide for seeding and managing test data in the ABA Access application.

## Quick Start

### Option 1: Use Dev Tools Page (Recommended)

1. Navigate to `/dev-tools` in your browser
2. Click **"🌱 Seed All Test Data"**
3. Wait for page reload
4. You're ready to test!

### Option 2: Use Console

Open browser console and run:

```javascript
// Import and run seed function
import { seedAllTestData } from '@/lib/testData/seedAll';
seedAllTestData();
```

Then reload the page.

## What Gets Seeded

### 👤 Authentication
- **User**: Catherine Nakitto
- **Phone**: +256782087786
- **Member ID**: A-123456
- **PIN**: 1234 (use this for wallet payments)

### 💰 Wallet
- **Balance**: UGX 190,000
- **Transactions**: 4 transactions
  - 2 top-ups (UGX 200,000 + UGX 100,000)
  - 2 purchases (UGX 65,000 + UGX 45,000)
- **Payment Methods**:
  - MTN MoMo: +256782087786 (default)
  - Airtel Money: +256700123456

### 📦 Packages
- **Active Packages** (2):
  1. **5 Visits Pack** (Consultations)
     - Price: UGX 65,000
     - Expires in 25 days
     - 3 visits remaining (2 used)
     - Co-pay: UGX 5,000

  2. **3 Tests Pack** (Lab Tests)
     - Price: UGX 75,000
     - Expires in 5 days (expiring soon!)
     - 1 visit remaining (2 used)
     - Co-pay: UGX 10,000

- **Completed Package** (1):
  - **3 Visits Pack** (Consultations)
  - All 3 visits used
  - Completed 15 days ago

### 👨‍👩‍👧‍👦 Family
- **Dependents** (2):
  1. **Sarah Nakitto**
     - Age: 6 years old
     - Gender: Female
     - Birth Certificate: BC-2018-0315

  2. **John Nakitto Jr.**
     - Age: 4 years old
     - Gender: Male
     - Birth Certificate: BC-2020-0722

## Individual Seeding

You can seed individual stores if needed:

### Seed Auth Only
```javascript
import { seedAuthStore } from '@/lib/testData/seedAll';
seedAuthStore();
```

### Seed Wallet Only
```javascript
import { seedWalletStore } from '@/lib/testData/seedAll';
seedWalletStore();
```

### Seed Packages Only
```javascript
import { seedPackageStore } from '@/lib/testData/seedAll';
seedPackageStore();
```

### Seed Family Only
```javascript
import { seedFamilyStore } from '@/lib/testData/seedAll';
seedFamilyStore();
```

## Clear All Data

### Using Dev Tools
1. Go to `/dev-tools`
2. Click **"🗑️ Clear All Data"**

### Using Console
```javascript
import { clearAllTestData } from '@/lib/testData/seedAll';
clearAllTestData();
```

## Check Data Status

### Using Dev Tools
Click **"📊 View Data Status"** to see what's currently seeded.

### Using Console
```javascript
import { getTestDataStatus } from '@/lib/testData/seedAll';
getTestDataStatus();
```

## Testing Scenarios

### Test Complete Purchase Flow

1. **Seed all data** using dev tools
2. Go to Dashboard
3. Click **PackagesCard** → navigates to /packages
4. Select **Consultations** category
5. Choose **5 Visits Pack**
6. Click **Buy this package**
7. Select **Myself** as recipient
8. Review payment (wallet has sufficient balance: UGX 190,000)
9. Check terms checkbox
10. Click **Confirm & Pay**
11. Enter PIN: **1234**
12. Wait for processing (80% success rate)
13. See success screen!
14. Go to **My Packages** to see new purchase

### Test Insufficient Wallet Balance

1. Clear wallet or set balance to 0
2. Try to purchase a package
3. **Expected**: Mobile money auto-selected, wallet disabled

### Test Multiple Dependents

1. Seed all data (includes 2 dependents)
2. Go to /packages/purchase/recipient
3. **Expected**: See options for "Myself", "My child", "My family"
4. Select different options to test

### Test PIN Validation

1. Start a wallet payment
2. Enter wrong PIN (not 1234)
3. **Expected**: Error message with attempts remaining
4. After 3 failed attempts: PIN input disabled

### Test Expiring Package

1. Seed data (includes package expiring in 5 days)
2. Go to My Packages
3. **Expected**: See warning badge on Lab Tests package

## Production Notes

When moving to production:

1. **Remove test PIN**: The hardcoded PIN "1234" in the purchase flow should be replaced with real PIN validation
2. **Real Payment APIs**: Replace mock payment processing with actual mobile money integration
3. **Database Seeding**: Move seed data to proper database fixtures
4. **Remove Dev Tools**: Either remove `/dev-tools` page or protect it with authentication

## File Locations

- **Seed Functions**: `/lib/testData/seedAll.ts`
- **Dev Tools Page**: `/app/(main)/dev-tools/page.tsx`
- **Package Mock Data**: `/lib/packages/mockData.ts`
- **Old Wallet Seed**: `/lib/utils/seedWallet.ts` (deprecated, use seedAll.ts)

## Troubleshooting

### Data Not Showing After Seed

**Problem**: Clicked seed but don't see data

**Solution**:
1. Check browser console for errors
2. Verify page reload occurred
3. Clear browser cache and try again
4. Use "View Data Status" to verify what's seeded

### Wallet Balance Incorrect

**Problem**: Balance doesn't match expected UGX 190,000

**Solution**:
1. Clear all data first
2. Then seed again
3. Or use "Seed Wallet Only" to reset just wallet

### Packages Not Appearing

**Problem**: My Packages page shows no packages

**Solution**:
1. Verify user is logged in (check Current User section)
2. Seed packages data
3. Reload page
4. Check browser console for errors

### Can't Access /dev-tools

**Problem**: Getting redirected or authentication error

**Solution**:
1. The page requires authentication
2. First seed auth data or sign in
3. Or access from welcome screen initially

## Testing Checklist

Use this checklist to verify test data is working:

- [ ] Can sign in with test credentials
- [ ] Dashboard shows user info (Catherine Nakitto)
- [ ] Wallet shows UGX 190,000 balance
- [ ] Wallet history shows 4 transactions
- [ ] My Packages shows 2 active packages
- [ ] Family page shows 2 dependents
- [ ] Can browse packages at /packages
- [ ] Can start purchase flow
- [ ] Payment method selector shows wallet balance
- [ ] PIN entry accepts "1234"
- [ ] Purchase success creates new package

---

**Last Updated**: December 30, 2025
**Version**: 1.0.0
