# Deploying ABA Access to Netlify

This guide will help you deploy the ABA Access application to Netlify.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup) (free)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Supabase project credentials

---

## Deployment Steps

### 1. Prepare Your Repository

Make sure all your changes are committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Connect to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select the `abaccess` repository

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
```

### 3. Configure Build Settings

When prompted or in the build settings page, configure:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Functions directory** | (leave empty) |

### 4. Set Environment Variables

In the Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"** and add the following:

#### Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NEXT_PUBLIC_APP_NAME=ABA Access
```

> **Important**: Replace the values with your actual Supabase credentials from your `.env.local` file.

### 5. Install Next.js Plugin

The `netlify.toml` file already includes the Next.js plugin configuration. Netlify will automatically install it during the first deployment.

If you need to install it manually:

1. Go to **Integrations** in your Netlify site dashboard
2. Search for **"Next.js Runtime"**
3. Click **"Enable"**

### 6. Deploy

1. Click **"Deploy site"** in the Netlify dashboard
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like `https://your-site.netlify.app`

---

## Post-Deployment

### Custom Domain (Optional)

To use a custom domain:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your DNS records

### Seed Database

After deployment, you'll need to seed your database with test data:

```bash
# Run the seed script locally pointing to production database
npm run seed
```

Or manually add data through your Supabase dashboard.

### Test the Deployment

1. Visit your deployed site URL
2. Try logging in with your test account:
   - Phone: `+256782087786`
   - PIN: `1234`
3. Test the main features:
   - Wallet functionality
   - Transaction history
   - Dashboard
   - Family management

---

## Continuous Deployment

Netlify automatically deploys your site whenever you push to your repository:

```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main

# Netlify automatically builds and deploys
```

### Branch Previews

Netlify can create preview deployments for pull requests:

1. Go to **Site settings** → **Build & deploy** → **Deploy contexts**
2. Enable **"Deploy Preview"** for pull requests
3. Each PR will get its own preview URL

---

## Monitoring & Logs

### View Build Logs

1. Go to **Deploys** in your Netlify dashboard
2. Click on any deployment to view logs
3. Check for errors if deployment fails

### View Function Logs

1. Go to **Functions** tab
2. Click on any function to view invocation logs

### Analytics (Optional)

Enable Netlify Analytics for visitor insights:

1. Go to **Site settings** → **Analytics**
2. Click **"Enable Analytics"**

---

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot find package`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error**: `Build exceeded maximum allowed runtime`

**Solution**:
- Check for infinite loops in your code
- Optimize heavy build processes
- Contact Netlify support to increase build timeout

### Environment Variables Not Working

**Solution**:
1. Verify variables are set in Netlify dashboard
2. Make sure variable names start with `NEXT_PUBLIC_` for client-side access
3. Trigger a new deployment after adding variables
4. Clear cache and redeploy: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### PWA Not Working

**Solution**:
1. Ensure service worker files are being generated in `/public`
2. Check HTTPS is enabled (required for PWA)
3. Verify `netlify.toml` headers are correct
4. Test in incognito/private browsing mode

### API Routes Failing

**Solution**:
1. Check Supabase credentials are correct
2. Verify CORS settings in Supabase dashboard
3. Check network requests in browser DevTools
4. Review function logs in Netlify dashboard

---

## Performance Optimization

### Enable Edge Functions (Optional)

For better performance, you can enable Netlify Edge Functions:

1. Go to **Site settings** → **Edge Functions**
2. Enable edge functions for your site
3. Deploy again

### Image Optimization

Next.js automatically optimizes images. Ensure you're using the `next/image` component:

```tsx
import Image from 'next/image';

<Image src="/path/to/image.jpg" width={500} height={300} alt="Description" />
```

### Caching Strategy

The `netlify.toml` file already includes optimal caching headers:
- Static assets: cached for 1 year
- Service worker: no cache (always fresh)
- Dynamic routes: handled by Next.js

---

## Useful Commands

```bash
# View deployment status
netlify status

# Open site in browser
netlify open

# View site logs
netlify logs

# Run functions locally
netlify dev

# Manual deploy
netlify deploy --prod
```

---

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Netlify Support](https://www.netlify.com/support/)

---

## Security Checklist

Before going to production:

- [ ] All environment variables are set in Netlify dashboard
- [ ] `.env.local` is not committed to Git (check `.gitignore`)
- [ ] Supabase Row Level Security (RLS) policies are configured
- [ ] HTTPS is enabled (Netlify enables this by default)
- [ ] Custom domain is configured (if applicable)
- [ ] Test user authentication flow
- [ ] Test wallet transactions
- [ ] Verify PWA installation works
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

---

## Getting Help

If you encounter issues:

1. Check the [Netlify Community Forums](https://answers.netlify.com/)
2. Review [Next.js Discussions](https://github.com/vercel/next.js/discussions)
3. Contact [Netlify Support](https://www.netlify.com/support/)
4. Check the deployment logs for specific error messages

---

**Congratulations!** Your ABA Access app should now be deployed and running on Netlify! 🎉
