# Supabase Setup Guide for ABA Access

This guide will walk you through setting up Supabase for the ABA Access application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Access to this codebase

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization (or create one)
4. Fill in project details:
   - **Name**: ABA Access (or your preferred name)
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Choose the closest region to your users (e.g., Africa - South Africa for Uganda)
   - **Pricing Plan**: Start with Free tier for development
5. Click "Create new project"
6. Wait for project provisioning (usually takes 1-2 minutes)

## Step 2: Get Your API Keys

1. Once your project is created, go to **Settings** → **API**
2. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (e.g., `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
3. Keep these values handy for the next step

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ABA Access
```

3. Save the file
4. **Important**: Never commit this file to git (it should be in `.gitignore`)

## Step 4: Set Up the Database Schema

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the `supabase-schema.sql` file from this project
5. Copy all the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)
8. Wait for the execution to complete
9. You should see a success message confirming all tables and policies were created

### What This Creates

The schema creates:
- **11 tables**: users, dependents, family_members, packages, user_packages, facilities, visits, bookings, wallets, transactions, payment_methods, notifications, approval_requests
- **11 custom enum types**: relationship, gender, package_status, etc.
- **Indexes** for performance optimization
- **Row Level Security (RLS)** policies for data security
- **Sample data**: 6 packages and 5 facilities for testing

## Step 5: Enable Phone Authentication (Optional)

If you want to use phone OTP authentication:

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Phone** provider
3. Configure SMS provider:
   - **Twilio** (recommended for production)
   - **MessageBird**
   - Or use Supabase's built-in phone auth (limited free tier)
4. Add your SMS provider credentials
5. Save changes

**Note**: The current implementation uses a simplified phone + PIN authentication. For production, you should use proper Supabase phone auth with OTP.

## Step 6: Configure Phone Auth Settings

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000` (for development)
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - Your production URL when deploying (e.g., `https://yourdomain.com/**`)
4. Save changes

## Step 7: Set Up Row Level Security (RLS) Policies

The schema includes basic RLS policies, but for production you should:

1. Go to **Authentication** → **Policies**
2. Review each table's policies
3. Update policies to use `auth.uid()` for proper user authentication
4. Example policy for users table:

```sql
-- Replace the simple policy with this auth-based one
DROP POLICY IF EXISTS "Users can view own data" ON users;

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id);
```

5. Apply similar changes to other tables

## Step 8: Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`
3. Try navigating to different pages
4. The middleware should now properly handle authentication

## Step 9: Verify Database Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see all 11 tables listed
3. Click on **packages** table
4. You should see 6 sample packages
5. Click on **facilities** table
6. You should see 5 sample facilities

## Step 10: Test Authentication Flow

1. Go to `/welcome` page
2. Try to access a protected page like `/dashboard`
3. You should be redirected back to `/welcome`
4. The middleware is working correctly!

## Troubleshooting

### Issue: "Invalid API key" error

**Solution**:
- Double-check your `.env.local` file
- Ensure you copied the **anon public** key, not the service_role key
- Restart your development server after changing env variables

### Issue: "relation does not exist" error

**Solution**:
- The schema wasn't applied correctly
- Go to SQL Editor and re-run the `supabase-schema.sql` script
- Check for any SQL errors in the output

### Issue: RLS policy errors

**Solution**:
- Temporarily disable RLS for testing: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`
- Review your policies in **Authentication** → **Policies**
- Ensure policies match your authentication setup

### Issue: Phone auth not working

**Solution**:
- Verify phone provider is enabled in **Authentication** → **Providers**
- Check SMS provider credentials
- Verify phone number format (international format: +256...)
- Check Supabase logs in **Logs** → **Auth Logs**

## Security Considerations for Production

### 1. Hash PINs
The current implementation stores PINs in plain text. For production:

```typescript
// lib/supabase/auth.ts
import bcrypt from 'bcrypt';

// When creating a user
const hashedPin = await bcrypt.hash(pin, 10);

// When verifying
const isValid = await bcrypt.compare(pin, userData.pin);
```

### 2. Update RLS Policies
Replace all `true` conditions with proper `auth.uid()` checks:

```sql
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id);
```

### 3. Enable MFA (Multi-Factor Authentication)
1. Go to **Authentication** → **Settings**
2. Enable **Multi-Factor Authentication**
3. Configure backup codes

### 4. Set Up Database Backups
1. Go to **Settings** → **Database**
2. Configure automatic backups
3. Download manual backups regularly

### 5. Configure Rate Limiting
1. Go to **Settings** → **API**
2. Set up rate limiting rules
3. Configure IP allowlists if needed

### 6. Use Environment-Specific Projects
- Create separate Supabase projects for:
  - Development
  - Staging
  - Production
- Never use production credentials in development

## Next Steps

1. ✅ Supabase project created
2. ✅ Environment variables configured
3. ✅ Database schema applied
4. ✅ Middleware set up
5. ⏳ Implement authentication flows in UI
6. ⏳ Add phone OTP verification
7. ⏳ Hash PINs before storing
8. ⏳ Update RLS policies for production
9. ⏳ Test all CRUD operations
10. ⏳ Deploy to production

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Integration Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Discord Community](https://discord.supabase.com)

## Support

If you encounter issues:
1. Check the Supabase logs in **Logs** → **Database Logs**
2. Review the [Supabase Discord](https://discord.supabase.com) for community help
3. Check the project's GitHub issues
4. Consult the Supabase documentation

---

**Status**: ✅ Supabase configuration is ready for development. Remember to update security settings before production deployment.
