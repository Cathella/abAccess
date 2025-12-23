# Supabase Setup Checklist

Use this checklist to track your Supabase setup progress.

## ✅ Completed (by development)

- [x] Install Supabase packages (`@supabase/ssr`, `@supabase/supabase-js`)
- [x] Create Supabase client configuration (`lib/supabase/client.ts`)
- [x] Create Supabase server configuration (`lib/supabase/server.ts`)
- [x] Create Supabase middleware utilities (`lib/supabase/middleware.ts`)
- [x] Create authentication helpers (`lib/supabase/auth.ts`)
- [x] Define database TypeScript types (`types/database.ts`)
- [x] Create root middleware for route protection (`middleware.ts`)
- [x] Create database schema SQL file (`supabase-schema.sql`)
- [x] Create comprehensive setup guide (`SUPABASE_SETUP_GUIDE.md`)
- [x] Fix phone field naming inconsistency
- [x] Update `.env.example` with helpful comments

## ⏳ To Do (requires Supabase account)

### Step 1: Create Supabase Project
- [ ] Sign up for Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project named "ABA Access"
- [ ] Choose region (recommend: Africa - South Africa)
- [ ] Save database password securely
- [ ] Wait for project provisioning

### Step 2: Configure Environment Variables
- [ ] Get Project URL from Supabase dashboard (Settings > API)
- [ ] Get Anon public key from Supabase dashboard (Settings > API)
- [ ] Update `.env.local` with actual credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
  ```
- [ ] Restart development server after updating env variables

### Step 3: Set Up Database
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Copy contents of `supabase-schema.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify all tables created (11 tables total)
- [ ] Check sample data exists (6 packages, 5 facilities)

### Step 4: Configure Authentication
- [ ] Go to Authentication > Providers
- [ ] Enable Phone provider (if using phone auth)
- [ ] Configure SMS provider (Twilio recommended)
- [ ] Set Site URL: `http://localhost:3000`
- [ ] Add Redirect URLs: `http://localhost:3000/**`

### Step 5: Test the Setup
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:3000`
- [ ] Try accessing protected page (should redirect to `/welcome`)
- [ ] Check Table Editor in Supabase (verify tables exist)
- [ ] Check browser console for any Supabase errors

## 🔒 Security Tasks (before production)

### Critical Security Updates
- [ ] **Hash PINs**: Update auth.ts to use bcrypt for PIN hashing
  - Install: `npm install bcrypt @types/bcrypt`
  - Update `verifyPhoneAndPin` function to use bcrypt
- [ ] **Update RLS Policies**: Replace `true` conditions with `auth.uid()` checks
- [ ] **Enable MFA**: Configure multi-factor authentication in Supabase
- [ ] **Set up backups**: Configure automatic database backups
- [ ] **Rate limiting**: Set up API rate limiting rules
- [ ] **Environment separation**: Create separate projects for dev/staging/prod

### RLS Policies to Update
- [ ] Update users table policies with auth.uid()
- [ ] Update dependents table policies with auth.uid()
- [ ] Update family_members table policies with auth.uid()
- [ ] Update user_packages table policies with auth.uid()
- [ ] Update visits table policies with auth.uid()
- [ ] Update wallets table policies with auth.uid()
- [ ] Update transactions table policies with auth.uid()
- [ ] Update payment_methods table policies with auth.uid()
- [ ] Update notifications table policies with auth.uid()

## 📚 Documentation Reference

- **Setup Guide**: See `SUPABASE_SETUP_GUIDE.md` for detailed instructions
- **Schema File**: See `supabase-schema.sql` for database structure
- **Middleware Setup**: See `MIDDLEWARE_SETUP.md` for route protection details
- **Supabase Clients**: See `lib/supabase/README.md` for usage examples

## 🐛 Troubleshooting

If you encounter issues:

1. **Invalid API key error**
   - Verify `.env.local` has correct values
   - Restart dev server: `npm run dev`

2. **Relation does not exist error**
   - Re-run `supabase-schema.sql` in SQL Editor
   - Check for SQL errors in output

3. **RLS policy errors**
   - Temporarily disable RLS for testing
   - Review policies in Authentication > Policies

4. **Authentication not working**
   - Check phone provider is enabled
   - Verify phone number format (+256...)
   - Check Auth Logs in Supabase dashboard

## 📊 Current Status

**Overall Progress**: 50% Complete

✅ **Development Setup**: Complete (11/11 tasks)
⏳ **Supabase Configuration**: Pending (0/5 tasks)
⏳ **Security Updates**: Pending (0/15 tasks)

**Next Step**: Create Supabase project and configure environment variables (see `SUPABASE_SETUP_GUIDE.md`)

---

Last Updated: 2025-12-22
