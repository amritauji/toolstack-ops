# Apply Security Fixes - Quick Guide

## Step 1: Run SQL Migration

Copy and paste the contents of `sql/fix_function_search_path.sql` into your Supabase SQL Editor and run it.

This will add `SET search_path = public` to these 6 functions:
- ✅ is_org_member
- ✅ is_org_admin  
- ✅ create_notification
- ✅ process_automation_triggers
- ✅ get_user_current_org
- ✅ generate_api_key

## Step 2: Enable Leaked Password Protection (Manual)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Policies**
3. Find **Password Strength** section
4. Enable **"Check against HaveIBeenPwned"**

## Expected Result

After applying:
- **6 warnings fixed** via SQL migration
- **1 warning fixed** via dashboard setting
- **Total: 7/7 warnings resolved** ✅

## Verify

Run Supabase Advisor again to confirm all warnings are cleared.
