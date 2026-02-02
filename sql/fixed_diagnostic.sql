-- CORRECTED SUPABASE DATABASE DIAGNOSTIC QUERIES

-- 1. Check if profiles table exists and its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- 2. Check current RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Check if RLS is enabled on profiles table (corrected)
SELECT schemaname, tablename, rowsecurity
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