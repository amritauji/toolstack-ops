-- Migration Verification Script
-- Run this to check if all migrations are applied correctly

-- Check if all required tables exist
SELECT 
  CASE 
    WHEN COUNT(*) = 8 THEN '✅ All tables exist'
    ELSE '❌ Missing tables: ' || (8 - COUNT(*))::text
  END as table_check
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles',
    'tasks',
    'projects',
    'comments',
    'attachments',
    'api_keys',
    'api_key_usage',
    'profile_requests'
  );

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'tasks', 'projects', 'comments', 'attachments', 'api_keys')
ORDER BY tablename;

-- Check indexes exist
SELECT 
  tablename,
  indexname,
  '✅ Index exists' as status
FROM pg_indexes 
WHERE schemaname = 'public'
  AND tablename IN ('tasks', 'projects', 'api_keys', 'api_key_usage')
ORDER BY tablename, indexname;

-- Check for missing policies
SELECT 
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Has policies'
    ELSE '❌ No policies'
  END as policy_status
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Summary
SELECT 
  '✅ Migration verification complete' as status,
  NOW() as checked_at;
