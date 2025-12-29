# Database Seeding Guide

This guide explains how to seed wallet data directly into your Supabase database for testing.

## What Gets Seeded

When you run the seed script, the following test data is added to your database:

### 👤 User
- **Name**: Test User
- **Phone**: +256782087786 (or custom number you provide)
- **PIN**: 1234
- **Member ID**: Auto-generated (e.g., A-335333)
- **NIN**: CM12345678ABCD

### 💰 Wallet
- **Balance**: UGX 290,000 (calculated from transactions)

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
1. **MTN MoMo** - Your phone number (Default)
2. **Airtel Money** - +256700123456
3. **Visa Card** - •••• 4242

---

## Quick Start

### Using Default Phone Number

Run this command to seed with the default phone number (+256782087786):

```bash
npm run seed
```

### Using Custom Phone Number

Provide any Ugandan phone number as an argument:

```bash
npm run seed:user +256700123456
npm run seed:user 0782087786
npm run seed:user 782087786
```

The script automatically formats the phone number to international format (+256XXXXXXXXX).

---

## What Happens

The script will:

1. ✅ Check if a user with that phone number exists
2. ✅ Create a new user if not found (with PIN: 1234)
3. ✅ Create a wallet for the user
4. ✅ Clear any existing transactions
5. ✅ Add 8 sample transactions (5 top-ups, 3 purchases)
6. ✅ Calculate and update the wallet balance
7. ✅ Clear existing payment methods
8. ✅ Add 3 saved payment methods

---

## After Seeding

You can now login to the app with:

- **Phone**: The phone number you used (or +256782087786 if using default)
- **PIN**: 1234

The wallet will have:
- A balance of **UGX 290,000**
- Transaction history with 8 transactions
- 3 saved payment methods

---

## Testing Scenarios

### Test Login
1. Open the app at `http://localhost:3000`
2. Enter phone: `+256782087786` (or your custom number)
3. Enter PIN: `1234`
4. Click "Sign In"

### Test Wallet Balance
- Navigate to `/dashboard`
- Should display **UGX 290,000** balance

### Test Transaction History
- Navigate to `/wallet/history`
- Should show 8 transactions with proper dates
- Filter by "All", "Top-up", or "Purchase"

### Test Payment Methods
- Start a wallet top-up flow
- Navigate to payment method selection
- Should see 3 saved payment methods

### Test Top-up Flow
- Navigate to `/wallet/top-up`
- Enter an amount
- Select a saved payment method
- Complete the flow

---

## Troubleshooting

### Error: Missing Supabase credentials
**Solution**: Make sure your `.env.local` file exists and contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Error: User already exists
**Solution**: The script will use the existing user and update their wallet data. This is expected behavior.

### Error: Invalid phone number
**Solution**: Make sure you're using a valid Ugandan phone number starting with 070, 074, 075, 076, 077, or 078.

### Can't login after seeding
**Solution**:
- Make sure you're using the correct phone number (check the script output)
- PIN is always `1234`
- Try formatting the phone number: `+256782087786`

---

## Data Persistence

- ✅ Data is stored in your **Supabase database**
- ✅ Persists across app restarts
- ✅ Visible to all authenticated users
- ✅ Can be viewed in Supabase dashboard

---

## Script Details

### Location
`scripts/seedDatabase.ts`

### Dependencies
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - PIN hashing
- `dotenv` - Environment variable loading
- `tsx` - TypeScript execution

### Database Tables Used
- `users` - User accounts
- `wallets` - User wallet balances
- `transactions` - Transaction history
- `payment_methods` - Saved payment methods

---

## Customization

To modify the seeded data, edit `scripts/seedDatabase.ts`:

```typescript
// Change transaction amounts
const transactions = [
  {
    amount: 50000, // Change this value
    description: 'MTN Mobile Money Top-up',
    // ...
  },
  // ...
];

// Change payment methods
const paymentMethods = [
  {
    type: 'mtnMomo',
    account_number: '+256700000000', // Change this
    // ...
  },
];
```

After making changes, run `npm run seed` again.

---

## Security Notes

- ⚠️ **Development only** - This script is for testing purposes
- ⚠️ Default PIN is `1234` - never use this in production
- ⚠️ Uses bcrypt for PIN hashing even in dev
- ⚠️ Requires Supabase credentials - keep `.env.local` secure

---

## Quick Reference

```bash
# Seed with default phone
npm run seed

# Seed with custom phone
npm run seed:user +256700123456

# Run TypeScript file directly
npx tsx scripts/seedDatabase.ts

# View script help
npx tsx scripts/seedDatabase.ts --help
```

---

## Next Steps

After seeding:
1. ✅ Login to the app with phone and PIN (1234)
2. ✅ Navigate to wallet section
3. ✅ View transaction history
4. ✅ Test top-up flows
5. ✅ Test payment method selection

Happy testing! 🎉
