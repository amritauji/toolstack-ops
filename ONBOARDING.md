# NexBoard Production Onboarding Guide

Complete setup guide for deploying NexBoard to production.

## Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- Vercel account (for hosting)
- Email provider account (Resend recommended, or SMTP)
- Optional: Sentry account for error tracking

## Step 1: Environment Variables

Copy `.env.example` to `.env.local` and configure:

### Required Variables
```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration (REQUIRED)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=NexBoard

# Email Provider (REQUIRED for invites)
RESEND_API_KEY=re_your_api_key
```

### Optional Variables
```env
# Sentry Error Tracking (OPTIONAL)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token

# Razorpay Payments (OPTIONAL - India only)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

## Step 2: Database Setup

Run these SQL migrations in **exact order** in your Supabase SQL Editor:

### Core Tables (Run First)
```sql
1. sql/complete_profiles_setup.sql       -- User profiles and auth
2. sql/performance_indexes.sql           -- Database optimization
3. sql/comments_system.sql               -- Task comments
4. sql/attachments_system.sql            -- File attachments
```

### Security & API (Run Second)
```sql
5. sql/secure_api_keys.sql               -- API key management
6. sql/fix_function_search_path.sql      -- Security hardening
```

### Multi-Tenancy (Run Third - CRITICAL)
```sql
7. sql/multi_tenancy.sql                 -- Organizations, members, invites
8. sql/add_invite_status.sql             -- Invite status tracking
9. sql/fix_org_rls_final.sql             -- RLS security functions
10. sql/org_scoped_tables.sql            -- Add org_id to all tables
```

### SaaS Features (Run Fourth)
```sql
11. sql/complete_saas_features.sql       -- Time tracking, automations, etc.
```

### Realtime (Run Last)
```sql
12. sql/enable_realtime.sql              -- Enable live updates
```

### Verify Installation
```sql
-- Run this to check everything is set up correctly
sql/verify_migrations.sql
```

## Step 3: Email Provider Setup

### Option A: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_api_key
   ```

### Option B: SMTP (Gmail, etc.)

1. Get SMTP credentials from your email provider
2. Add to `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=noreply@yourdomain.com
   ```

## Step 4: Supabase Configuration

### Enable Realtime
1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for these tables:
   - tasks
   - task_comments
   - notifications
   - time_entries

### Enable Password Protection (Recommended)
1. Go to Authentication → Policies
2. Enable "Check against HaveIBeenPwned"

### Storage Setup (for file attachments)
1. Go to Storage → Create bucket
2. Name it `attachments`
3. Set to Public or Private based on your needs
4. Add RLS policies for org-scoped access

## Step 5: Deploy to Vercel

### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select Next.js framework preset

### Add Environment Variables
Add all variables from `.env.local` to Vercel:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL (use your Vercel domain)
- RESEND_API_KEY (or SMTP variables)
- NEXT_PUBLIC_SENTRY_DSN (optional)

### Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed URL

## Step 6: Post-Deployment Checks

### Test Core Features
- [ ] User signup and login works
- [ ] Organization is auto-created on signup
- [ ] Tasks can be created and updated
- [ ] Real-time updates work (open in 2 tabs)
- [ ] Invite system sends emails
- [ ] File uploads work (if configured)

### Test Multi-Tenancy
- [ ] Create a second organization
- [ ] Switch between organizations
- [ ] Invite a user to organization
- [ ] Verify data isolation (users only see their org's data)

### Monitor Performance
- [ ] Check Vercel Analytics for load times
- [ ] Check Supabase Dashboard for query performance
- [ ] Check Sentry for any errors (if configured)

## Troubleshooting

### "No organization selected" error
- User's profile doesn't have `current_org_id` set
- Run: `UPDATE profiles SET current_org_id = (SELECT id FROM org_members WHERE user_id = profiles.id LIMIT 1) WHERE current_org_id IS NULL;`

### Invite emails not sending
- Check email provider API key is correct
- Check logs in Vercel deployment
- In development, emails are logged to console

### RLS policy errors
- Ensure all migrations ran successfully
- Check `is_org_member()` and `is_org_admin()` functions exist
- Verify user is member of organization

### Build failures
- Run `npm run lint` locally to catch errors
- Check all environment variables are set in Vercel
- Review build logs for specific errors

## Production Checklist

Before going live:
- [ ] All environment variables configured
- [ ] All database migrations applied
- [ ] Email provider tested and working
- [ ] Sentry error tracking configured (optional)
- [ ] Custom domain configured in Vercel
- [ ] SSL certificate active
- [ ] Backup strategy in place
- [ ] Rate limiting tested
- [ ] Mobile responsiveness verified
- [ ] Security audit completed (run Supabase Advisor)

## Support

- Documentation: See README.md and sql/README.md
- Issues: Open a GitHub issue
- Security: Report privately to maintainers

---

**Estimated Setup Time**: 30-45 minutes  
**Difficulty**: Intermediate  
**Cost**: Free tier available for all services
