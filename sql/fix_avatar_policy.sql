-- Drop existing policy
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;

-- Create new policy that allows uploads during signup (before email confirmation)
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Alternative: If above doesn't work, use this more permissive policy
-- DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
-- CREATE POLICY "Users can upload own avatar" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'avatars'
--   );