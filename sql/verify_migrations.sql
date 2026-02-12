-- Migration Verification Script
-- Run this to check if all migrations are applied correctly

-- Check if all required tables exist
SELECT 
  CASE 
    WHEN COUNT(*) >= 12 THEN '✅ All core tables exist (' || COUNT(*)::text || '/12+)'
    ELSE '❌ Missing tables: ' || (12 - COUNT(*))::text
  END as table_check
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles',
    'tasks',
    'projects',
    'task_comments',
    'attachments',
    'api_keys',
    'api_key_usage',
    'organizations',
    'org_members',
    'org_invites',
    'notifications',
    'automations',
    'saved_filters',
    'time_entries'
  );

-- Check RLS is enabled on critical tables
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 
    'tasks', 
    'projects', 
    'task_comments', 
    'attachments', 
    'api_keys',
    'organizations',
    'org_members',
    'org_invites',
    'notifications',
    'automations',
    'saved_filters',
    'time_entries'
  )
ORDER BY tablename;

-- Check critical indexes exist
SELECT 
  tablename,
  indexname,
  '✅ Index exists' as status
FROM pg_indexes 
WHERE schemaname = 'public'
  AND tablename IN ('tasks', 'projects', 'api_keys', 'org_members', 'notifications')
ORDER BY tablename, indexname;

-- Check for RLS policies
SELECT 
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Has ' || COUNT(*)::text || ' policies'
    ELSE '❌ No policies'
  END as policy_status
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Check critical functions exist
SELECT 
  routine_name,
  '✅ Function exists' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'is_org_member',
    'is_org_admin',
    'create_notification',
    'process_automation_triggers',
    'get_user_current_org',
    'generate_api_key'
  )
ORDER BY routine_name;

-- Summary
SELECT 
  '✅ Migration verification complete' as status,
  NOW() as checked_at;
