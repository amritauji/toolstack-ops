# Setup Guide

## 🚀 Quick Setup

### 1. Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for project to be created

2. **Get API Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the following values:
     - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
     - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)
     - **service_role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

3. **Update Environment Variables**
   - Open `.env.local` in your project root
   - Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
   ```

### 2. Database Setup

Run the SQL files in your Supabase SQL Editor in this order:

1. `sql/complete_profiles_setup.sql` - User profiles and authentication
2. `sql/performance_indexes.sql` - Database performance optimization
3. `sql/comments_system.sql` - Task comments functionality
4. `sql/attachments_system.sql` - File attachments system
5. `sql/enable_realtime.sql` - Real-time updates

### 3. Test the Setup

1. **Restart the development server**:
   ```bash
   npm run dev
   ```

2. **Try to sign up**:
   - Go to `/signup`
   - Create a test account
   - Check your email for confirmation

3. **Login and test features**:
   - Login with your test account
   - Create tasks, add comments, upload files
   - Test real-time updates in multiple browser tabs

## 🔧 Troubleshooting

### "Failed to fetch" Error
- ✅ Check that Supabase URL and keys are correct in `.env.local`
- ✅ Restart the development server after changing environment variables
- ✅ Verify your Supabase project is active (not paused)

### Authentication Issues
- ✅ Run the `complete_profiles_setup.sql` script
- ✅ Check that RLS (Row Level Security) is enabled on tables
- ✅ Verify email confirmation is working

### Database Errors
- ✅ Run all SQL setup scripts in order
- ✅ Check that tables exist in Supabase Table Editor
- ✅ Verify RLS policies are created correctly

## 📚 Next Steps

Once setup is complete, you can:
- Customize the UI and branding
- Add more features and integrations
- Deploy to production (Vercel recommended)
- Set up monitoring and analytics

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all SQL scripts have been executed
4. Check Supabase logs in the dashboard