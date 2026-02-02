-- SUPABASE DATABASE DIAGNOSTIC QUERIES
-- Run these queries in Supabase SQL Editor to understand current state

-- 1. Check if profiles table exists and its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- 2. Check current RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Check if RLS is enabled on profiles table
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 4. Check existing profiles data
SELECT id, full_name, username, email, avatar_url, role, created_at
FROM profiles 
LIMIT 5;

-- 5. Check auth.users table structure
SELECT id, email, raw_user_meta_data, created_at
FROM auth.users 
LIMIT 5;

-- 6. Check storage buckets
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets;

-- 7. Check storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 8. Check if trigger exists for profile creation
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' AND trigger_schema = 'auth';

-- 9. Check functions related to profile handling
SELECT routine_name, routine_type, routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%profile%' OR routine_name LIKE '%user%';

-- EXPECTED RESULTS FOR WORKING SYSTEM:
-- 1. profiles table should have: id (UUID), full_name (TEXT), username (TEXT), email (TEXT), avatar_url (TEXT), role (TEXT)
-- 2. RLS policies should allow users to SELECT/UPDATE/INSERT their own profiles only
-- 3. RLS should be enabled (rowsecurity = true)
-- 4. Should have profiles data matching auth.users
-- 5. auth.users should have raw_user_meta_data with full_name and username
-- 6. Should have 'avatars' bucket with public = true
-- 7. Storage policies should allow uploads to avatars bucket
-- 8. Should have trigger 'on_auth_user_created' that calls handle_new_user()
-- 9. Should have handle_new_user() function that creates profiles automatically