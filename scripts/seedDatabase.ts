/**
 * Supabase Database Seeding Script
 *
 * This script seeds wallet data into the Supabase database for testing.
 *
 * Usage:
 *   npx tsx scripts/seedDatabase.ts [phone_number]
 *
 * Example:
 *   npx tsx scripts/seedDatabase.ts +256782087786
 *   npx tsx scripts/seedDatabase.ts 0782087786
 *
 * If no phone number is provided, it will use the default: +256782087786
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Format a Ugandan phone number to international format
 */
function formatUgandanPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
  if (cleaned.startsWith('256')) cleaned = cleaned.substring(3);
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  return `+256${cleaned}`;
}

/**
 * Generate a unique member ID in format A-XXXXXX
 */
function generateMemberId(): string {
  const randomNum = Math.floor(Math.random() * 900000) + 100000;
  return `A-${randomNum}`;
}

/**
 * Main seeding function
 */
async function seedDatabase(phoneNumber: string) {
  console.log('🌱 Starting database seed...\n');

  const formattedPhone = formatUgandanPhone(phoneNumber);
  console.log(`📱 Phone number: ${formattedPhone}`);

  try {
    // Step 1: Check if user exists or create new user
    console.log('\n1️⃣  Checking for existing user...');
    let { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', formattedPhone)
      .single();

    let userId: string;

    if (existingUser) {
      console.log(`✅ User found: ${existingUser.name} (ID: ${existingUser.id})`);
      userId = existingUser.id;
    } else {
      console.log('📝 Creating new user...');

      // Hash a default PIN (1234)
      const hashedPin = await bcrypt.hash('1234', 10);
      const memberId = generateMemberId();

      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          phone: formattedPhone,
          name: 'Test User',
          pin: hashedPin,
          member_id: memberId,
          nin: 'CM12345678ABCD',
        })
        .select()
        .single();

      if (userError || !newUser) {
        throw new Error(`Failed to create user: ${userError?.message}`);
      }

      console.log(`✅ User created: ${newUser.name} (ID: ${newUser.id}, Member: ${newUser.member_id})`);
      console.log(`🔑 PIN: 1234`);
      userId = newUser.id;
    }

    // Step 2: Check if wallet exists or create new wallet
    console.log('\n2️⃣  Checking for existing wallet...');
    let { data: existingWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    let walletId: string;

    if (existingWallet) {
      console.log(`✅ Wallet found (ID: ${existingWallet.id})`);
      walletId = existingWallet.id;
    } else {
      console.log('💰 Creating new wallet...');

      const { data: newWallet, error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: userId,
          balance: 0,
        })
        .select()
        .single();

      if (walletError || !newWallet) {
        throw new Error(`Failed to create wallet: ${walletError?.message}`);
      }

      console.log(`✅ Wallet created (ID: ${newWallet.id})`);
      walletId = newWallet.id;
    }

    // Step 3: Clear existing transactions
    console.log('\n3️⃣  Clearing existing transactions...');
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('wallet_id', walletId);

    if (deleteError) {
      console.log(`⚠️  Warning: Could not clear transactions: ${deleteError.message}`);
    } else {
      console.log('✅ Transactions cleared');
    }

    // Step 4: Add sample transactions
    console.log('\n4️⃣  Adding sample transactions...');

    const now = Date.now();
    const transactions = [
      {
        wallet_id: walletId,
        type: 'topUp' as const,
        amount: 50000,
        description: 'MTN Mobile Money Top-up',
        reference: `TXN${now}001`,
        status: 'completed' as const,
        created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        wallet_id: walletId,
        type: 'topUp' as const,
        amount: 100000,
        description: 'Visa Card Top-up',
        reference: `TXN${now}002`,
        status: 'completed' as const,
        created_at: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        wallet_id: walletId,
        type: 'purchase' as const,
        amount: -25000,
        description: 'Package Purchase: Family Health Package',
        reference: `TXN${now}003`,
        status: 'completed' as const,
        created_at: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        wallet_id: walletId,
        type: 'topUp' as const,
        amount: 75000,
        description: 'Visa Card Top-up (with fee)',
        reference: `TXN${now}004`,
        status: 'completed' as const,
        created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        wallet_id: walletId,
        type: 'purchase' as const,
        amount: -15000,
        description: 'Package Purchase: Basic Checkup',
        reference: `TXN${now}005`,
        status: 'completed' as const,
        created_at: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        wallet_id: walletId,
        type: 'topUp' as const,
        amount: 30000,
        description: 'Airtel Money Top-up',
        reference: `TXN${now}006`,
        status: 'completed' as const,
        created_at: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        wallet_id: walletId,
        type: 'purchase' as const,
        amount: -45000,
        description: 'Package Purchase: Dental Care Package',
        reference: `TXN${now}007`,
        status: 'completed' as const,
        created_at: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        wallet_id: walletId,
        type: 'topUp' as const,
        amount: 120000,
        description: 'MTN Mobile Money Top-up',
        reference: `TXN${now}008`,
        status: 'completed' as const,
        created_at: new Date(now - 30 * 60 * 1000).toISOString(),
      },
    ];

    const { data: insertedTransactions, error: txError } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();

    if (txError) {
      throw new Error(`Failed to insert transactions: ${txError.message}`);
    }

    console.log(`✅ Added ${insertedTransactions.length} transactions`);

    // Step 5: Calculate and update wallet balance
    console.log('\n5️⃣  Calculating wallet balance...');

    const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    const { error: updateError } = await supabase
      .from('wallets')
      .update({ balance, updated_at: new Date().toISOString() })
      .eq('id', walletId);

    if (updateError) {
      throw new Error(`Failed to update balance: ${updateError.message}`);
    }

    console.log(`✅ Balance updated: UGX ${balance.toLocaleString()}`);

    // Step 6: Clear existing payment methods
    console.log('\n6️⃣  Clearing existing payment methods...');
    const { error: deletePaymentError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('user_id', userId);

    if (deletePaymentError) {
      console.log(`⚠️  Warning: Could not clear payment methods: ${deletePaymentError.message}`);
    } else {
      console.log('✅ Payment methods cleared');
    }

    // Step 7: Add saved payment methods
    console.log('\n7️⃣  Adding saved payment methods...');

    const paymentMethods = [
      {
        user_id: userId,
        type: 'mtnMomo' as const,
        provider: 'MTN Mobile Money',
        account_number: formattedPhone,
        is_default: true,
      },
      {
        user_id: userId,
        type: 'airtelMoney' as const,
        provider: 'Airtel Money',
        account_number: '+256700123456',
        is_default: false,
      },
      {
        user_id: userId,
        type: 'card' as const,
        provider: 'Visa',
        account_number: '4242',
        is_default: false,
      },
    ];

    const { data: insertedPaymentMethods, error: pmError } = await supabase
      .from('payment_methods')
      .insert(paymentMethods)
      .select();

    if (pmError) {
      throw new Error(`Failed to insert payment methods: ${pmError.message}`);
    }

    console.log(`✅ Added ${insertedPaymentMethods.length} payment methods`);

    // Summary
    console.log('\n✨ Database seeding complete!\n');
    console.log('═══════════════════════════════════════');
    console.log('📊 Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`👤 User: ${existingUser?.name || 'Test User'}`);
    console.log(`📱 Phone: ${formattedPhone}`);
    console.log(`🔑 PIN: 1234`);
    console.log(`💰 Balance: UGX ${balance.toLocaleString()}`);
    console.log(`📝 Transactions: ${insertedTransactions.length}`);
    console.log(`💳 Payment Methods: ${insertedPaymentMethods.length}`);
    console.log('═══════════════════════════════════════\n');
    console.log('🚀 You can now login with:');
    console.log(`   Phone: ${formattedPhone}`);
    console.log(`   PIN: 1234\n`);

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Main execution
const phoneArg = process.argv[2] || '+256782087786';
seedDatabase(phoneArg);
